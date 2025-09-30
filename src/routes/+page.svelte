<script lang="ts">
    import type LanyardUserData from "$lib/assets/LanyardUserData";
    import { onMount } from "svelte";
    import type { SongData } from "./MusicCard.svelte";
    import MusicCard from "./MusicCard.svelte";

    const lyWebsocket = new WebSocket("wss://api.lanyard.rest/socket");
    let lanyardData: LanyardUserData = {
        discord_user: {
            id: "900126154881646634",
            username: "Piny",
            discriminator: "0000",
            avatar: "a_3b3c3d4e5f6g7h8i9j0k1l2m3n4o5p6q",
            clan: undefined,
            primary_guild: {
                tag: "",
                identity_guild_id: "",
                badge: "",
                identity_enabled: false
            },
            avatar_decoration_data: {
                sku_id: "",
                asset: "",
                expires_at: null
            },
            collectibles: {
                nameplate: {
                    label: "",
                    sku_id: "",
                    asset: "",
                    expires_at: null,
                    palette: ""
                }
            },
            bot: false,
            global_name: "",
            display_name: "",
            public_flags: 0,
            display_name_styles: undefined
        },
        activities: [],
        active_on_discord_mobile: false,
        active_on_discord_desktop: false,
        active_on_discord_web: false,
        listening_to_spotify: false,
        spotify: null,
        kv: {},
        discord_status: "",
        active_on_discord_embedded: false
    };

    let latestYTMUpdate = 0;
    let youtubeMusicSongData: SongData | null = null;
    let youtubeMusicHistory: SongData[] = [];
    let previousSongKey: string | null = null;
    let forceImageRefresh = 0;

    // Discord activity image management
    let discordActivityImageLoaded = false;
    let discordProfileImageLoaded = false;
    let lastActivityUpdate = 0;
    let activityImageRefresh = 0;
    let profileImageLoading = false;
    let activityImageLoading = false;
    
    // Current image URLs
    let currentProfileImageUrl = '';
    let currentActivityImageUrl = '';
    
    // Function to preload and swap images
    const preloadAndSwapImage = (newUrl: string, isProfile: boolean) => {
        const img = new Image();
        img.onload = () => {
            // Image is cached, now update the URL
            if (isProfile) {
                currentProfileImageUrl = newUrl;
                profileImageLoading = false;
            } else {
                currentActivityImageUrl = newUrl;
                activityImageLoading = false;
            }
        };
        img.onerror = () => {
            if (isProfile) {
                profileImageLoading = false;
            } else {
                activityImageLoading = false;
            }
        };
        img.src = newUrl;
        
        // Set loading state
        if (isProfile) {
            profileImageLoading = true;
        } else {
            activityImageLoading = true;
        }
    };

    // Function to fetch YouTube Music data
    const fetchYTMData = async (forceUpdate = false) => {
        try {
            const cacheBuster = forceUpdate ? `&cb=${Date.now()}` : '';
            const request = await fetch(`https://ytm-music-tracker-default-rtdb.europe-west1.firebasedatabase.app/ytm-current-song.json?${cacheBuster}`);
            const ytmData = await request.json();
            
            const newSongData = ytmData.currentSong as SongData || null;
            
            // Check if the song actually changed
            if (newSongData && (!youtubeMusicSongData || 
                newSongData.title !== youtubeMusicSongData.title || 
                newSongData.artist !== youtubeMusicSongData.artist ||
                newSongData.timestamp !== youtubeMusicSongData.timestamp)) {
                forceImageRefresh++;
            }
            
            youtubeMusicSongData = newSongData;
            youtubeMusicHistory = ytmData.history as SongData[] || [];
            console.log('Updated YouTube Music song data:', youtubeMusicSongData);
        } catch (error) {
            console.error('Failed to fetch YouTube Music data:', error);
        }
    };

    onMount(() => {
        // Initialize image URLs
        const timestamp = Date.now();
        currentProfileImageUrl = `https://lanyard.cnrad.dev/api/900126154881646634?bg=0000000&hideActivity=true&t=${timestamp}`;
        currentActivityImageUrl = `https://lanyard.cnrad.dev/api/900126154881646634?bg=0000000&hideProfile=true&&idleMessage=Nobody%20here%20%3A(&t=${timestamp}`;
        
        lyWebsocket.onmessage = async(event) => {
            const data = JSON.parse(event.data);
            if (data.op === 1) {
                lyWebsocket.send(
                    JSON.stringify({
                        op: 2,
                        d: {
                            subscribe_to_id: "900126154881646634",
                        },
                    }),
                );

                setInterval(() => {
                    lyWebsocket.send(
                        JSON.stringify({
                            op: 3,
                        }),
                    );
                }, data.d.heartbeat_interval);
            }

            if (data.t === "INIT_STATE") {
                console.log("Initial State:", data.d);
            }

            if (data.t == "INIT_STATE" || data.t === "PRESENCE_UPDATE") {
                const previousActivities = lanyardData.activities;
                lanyardData = data.d;

                // Check if activities have changed to trigger image refresh
                const currentActivities = lanyardData.activities;
                const activitiesChanged = JSON.stringify(previousActivities) !== JSON.stringify(currentActivities);
                
                if (activitiesChanged) {
                    const timestamp = Date.now();
                    const refreshParam = Math.random();
                    
                    // Preload new images before swapping
                    const newProfileUrl = `https://lanyard.cnrad.dev/api/900126154881646634?bg=0000000&hideActivity=true&t=${timestamp}&r=${refreshParam}`;
                    const newActivityUrl = `https://lanyard.cnrad.dev/api/900126154881646634?bg=0000000&hideProfile=true&t=${timestamp}&r=${refreshParam}`;
                    
                    preloadAndSwapImage(newProfileUrl, true);
                    preloadAndSwapImage(newActivityUrl, false);
                    
                    activityImageRefresh++;
                    lastActivityUpdate = timestamp;
                }

                if (lanyardData.activities.find(a => a.name == 'YouTube Music')) {
                    let ytmActivity = lanyardData.activities.find(a => a.name == 'YouTube Music');
                    if (ytmActivity) {
                        // Create a unique key from song title and artist to detect changes
                        const currentSongKey = ytmActivity.details && ytmActivity.state 
                            ? `${ytmActivity.details}::${ytmActivity.state}` 
                            : null;
                        
                        // Only fetch if song has changed or we don't have data yet
                        if (currentSongKey && currentSongKey !== previousSongKey) {
                            // Update no more than once every second as a fallback
                            if (Date.now() - latestYTMUpdate < 1 * 1000) return;
                            
                            latestYTMUpdate = Date.now();
                            previousSongKey = currentSongKey;
                            
                            await fetchYTMData(true); // Force update with cache busting
                        }
                    } else {
                        youtubeMusicSongData = null;
                        previousSongKey = null;
                    }
                } else {
                    youtubeMusicSongData = null;
                    previousSongKey = null;
                }
            }
        }

        // Periodic refresh of Discord activity images every 30 seconds
        setInterval(() => {
            if (view === 'profile') {
                const timestamp = Date.now();
                const refreshParam = Math.random();
                
                // Preload new images before swapping
                const newProfileUrl = `https://lanyard.cnrad.dev/api/900126154881646634?bg=0000000&hideActivity=true&t=${timestamp}&r=${refreshParam}`;
                const newActivityUrl = `https://lanyard.cnrad.dev/api/900126154881646634?bg=0000000&hideProfile=true&t=${timestamp}&r=${refreshParam}`;
                
                preloadAndSwapImage(newProfileUrl, true);
                preloadAndSwapImage(newActivityUrl, false);
                
                activityImageRefresh++;
                lastActivityUpdate = timestamp;
            }
        }, 30000);
    });

    let view = 'base';

    type DiscordStatus = 'online' | 'idle' | 'dnd' | 'offline';
    let discordStatusColors: Record<DiscordStatus, string> = {
        online: '#43b581',
        idle: '#faa61a',
        dnd: '#f04747',
        offline: '#747f8d'
    };

    let discordStatusDesktopSVG = (status: DiscordStatus, size: number = 42) => `
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="2 2.5 20 18">
            <path fill="${discordStatusColors[status] || '#747f8d'}" d="M4 2.5c-1.103 0-2 .897-2 2v11c0 1.104.897 2 2 2h7v2H7v2h10v-2h-4v-2h7c1.103 0 2-.896 2-2v-11c0-1.103-.897-2-2-2H4Zm16 2v9H4v-9h16Z"/>
        </svg>
    `;

    let discordStatusMobileSVG = (status: DiscordStatus, size: number = 42) => `
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1000 1500">
            <path fill="${discordStatusColors[status] || '#747f8d'}" d="M 187 0 L 813 0 C 916.277 0 1000 83.723 1000 187 L 1000 1313 C 1000 1416.277 916.277 1500 813 1500 L 187 1500 C 83.723 1500 0 1416.277 0 1313 L 0 187 C 0 83.723 83.723 0 187 0 Z M 125 1000 L 875 1000 L 875 250 L 125 250 Z M 500 1125 C 430.964 1125 375 1180.964 375 1250 C 375 1319.036 430.964 1375 500 1375 C 569.036 1375 625 1319.036 625 1250 C 625 1180.964 569.036 1125 500 1125 Z"/>
        </svg>
    `;

    let pfpLoaded = false;
</script>

<main>
    <div class="content">
        <span class="header">
            <h1>Piny</h1>
            <button on:click={() => {
                view = view === 'profile' ? 'base' : 'profile';
            }}>
                <picture>
                    <img
                        src="https://cdn.discordapp.com/avatars/{lanyardData.discord_user.id}/{lanyardData.discord_user.avatar}.png"
                        alt="Discord Profile Icon"
                        class:hidden={!pfpLoaded}
                        style="background: #2f3136; min-width: 32px; min-height: 32px;"
                        on:load={() => {pfpLoaded = true}}
                    />
                    {#if !pfpLoaded}
                        <img
                            src="https://cdn.discordapp.com/embed/avatars/0.png"
                            alt="Discord Profile Icon"
                            class:hidden={pfpLoaded}
                            style="background: #2f3136; min-width: 32px; min-height: 32px;"
                        />
                    {/if}
                </picture>
            </button>
            <button on:click={() => {
                view = view === 'music' ? 'base' : 'music';
                if (view === 'music' && youtubeMusicSongData === null) {
                    // Force fetch if no song data yet
                    latestYTMUpdate = 0;
                    previousSongKey = null;
                    fetchYTMData(true);
                }
            }}>
                {#if youtubeMusicSongData}
                    <picture>
                        {#key `${youtubeMusicSongData.title}-${youtubeMusicSongData.artist}-${youtubeMusicSongData.timestamp}-${forceImageRefresh}`}
                            <img
                                src="{youtubeMusicSongData.thumbnail}?t={youtubeMusicSongData.timestamp}&r={forceImageRefresh}"
                                width="32"
                                height="32"
                                alt="YouTube Music Album Art"
                                style="background: #2f3136; min-width: 32px; min-height: 32px; border-radius: 4px;"
                            />
                        {/key}
                    </picture>
                {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-music">
                        <path d="M9 18V5l12-2v13"></path>
                        <circle cx="6" cy="18" r="3"></circle>
                        <circle cx="18" cy="16" r="3"></circle>
                    </svg>
                {/if}
            </button>
        </span>
        {#if view === 'base'}
        <p>
            Heya! I'm Ember (or Piny<span class="note">/pɪn iː/</span>), a hobbyist developer and (somewhat) graphic designer, and well this is my site. It's quite a bit empty; however, as I always say to myself, "Less is more".
        </p>
        <MusicCard
            songData={youtubeMusicSongData}
            startTimestamp={lanyardData.activities.find(a => a.name == 'YouTube Music')?.timestamps?.start || null}
            forceRefresh={forceImageRefresh}
        />
        {:else if view === 'profile'}
        <a href="https://discordlookup.com/user/{lanyardData.discord_user.id}" style="text-decoration: none; color: inherit;" target="_blank" rel="noopener noreferrer">
            <div class="discord-profile">
                <picture>
                    <img 
                        src={currentProfileImageUrl}
                        alt="Discord Profile"
                        class:loading={profileImageLoading}
                        draggable="false"
                        on:load={() => {discordProfileImageLoaded = true}}
                        on:error={() => {discordProfileImageLoaded = true}}
                    />
                </picture>
                <picture>
                    <img 
                        src={currentActivityImageUrl}
                        alt="Discord Activity"
                        class:loading={activityImageLoading}
                        draggable="false"
                        on:load={() => {discordActivityImageLoaded = true}}
                        on:error={() => {discordActivityImageLoaded = true}}
                    />
                </picture>
                <h2>
                    <div class="status-icons">
                        {#if lanyardData.active_on_discord_desktop || lanyardData.active_on_discord_web}
                            {@html discordStatusDesktopSVG(lanyardData.discord_status as DiscordStatus, 32)}
                        {/if}
                        {#if lanyardData.active_on_discord_mobile}
                            {@html discordStatusMobileSVG(lanyardData.discord_status as DiscordStatus, 32)}
                        {/if}
                    </div>
                </h2>
            </div>
        </a>
        {:else if view === 'music'}
            <MusicCard
                songData={youtubeMusicSongData}
                startTimestamp={lanyardData.activities.find(a => a.name == 'YouTube Music')?.timestamps?.start || null}
                forceRefresh={forceImageRefresh}
            /><br/>
            <h2>History</h2>
            {#if youtubeMusicHistory.length > 0}
                <div class="music-history">
                    {#each youtubeMusicHistory as song}
                        <MusicCard
                            songData={song}
                            autoUpdateProgress={false}
                        />
                    {/each}
                </div>
            {:else}
                <p>No recent songs played.</p>
            {/if}
        {/if}
        <p class="note">You can switch views using the buttons above, or switch pages with either the navigation bar / scrolling.</p>
    </div>
</main>

<style lang="scss">
    .hidden {
        display: none;
    }

    .discord-profile {
        picture {
            display: block;
            margin-bottom: 0.5rem;
            
            img {
                transition: opacity 0.3s ease;
                border-radius: 8px;
                max-width: 100%;
                height: auto;
                
                &.loading {
                    opacity: 0.6;
                    filter: blur(1px);
                }
            }
        }

        h2 {
            margin: 0;
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }

        .status-icons {
            display: inline-flex;
            gap: 0.5rem;
            margin-left: 1rem;

            padding: 0.8rem;

            border-radius: 10px;

            background-color: #1b1b1bad;
        }

        background-color: #151516b9;
        padding: 1rem;
        border-radius: 10px;
        margin-bottom: 1rem;
    }

    .note {
        font-size: 1.2rem;
        color: #888;
        
        // Align with the top of the text
        position: relative;
        top: -0.2rem;
    }

    .music-history {
        display: grid;

        // Responsive grid: 1 column on small screens, 2 on medium, 3 on large
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;

        margin-bottom: 1rem;
    }
</style>
