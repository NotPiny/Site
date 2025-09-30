<script lang="ts" context="module">
    export interface SongData {
        title: string;
        artist: string;
        album?: string;
        url?: string;
        duration?: number;
        position?: number;
        thumbnail?: string;
        timestamp: number;
    }
</script>

<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    
    export let songData: SongData | null = null;
    export let autoUpdateProgress: boolean = true;
    export let startTimestamp: number | null = null;
    export let forceRefresh: number = 0;
    
    let currentPosition = 0;
    let intervalId: number | null = null;
    let imageLoaded = false;
    let previousThumbnail: string | null = null;
    
    // Preload image when song data changes
    $: if (songData?.thumbnail && (songData.thumbnail !== previousThumbnail || forceRefresh)) {
        imageLoaded = false;
        previousThumbnail = songData.thumbnail;
        
        // Preload the image
        const img = new Image();
        img.onload = () => {
            imageLoaded = true;
        };
        img.onerror = () => {
            imageLoaded = false;
        };
        img.src = `${songData.thumbnail}?t=${songData.timestamp}&r=${forceRefresh}`;
    }
    
    function formatTime(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    function updateProgress() {
        if (songData && songData.duration) {
            const effectiveTimestamp = startTimestamp || songData.timestamp;
            if (effectiveTimestamp) {
                const elapsed = (Date.now() - effectiveTimestamp) / 1000;
                currentPosition = Math.min(elapsed, songData.duration);
                
                // Stop updating if song is finished
                if (currentPosition >= songData.duration) {
                    if (intervalId) {
                        clearInterval(intervalId);
                        intervalId = null;
                    }
                }
            }
        }
    }
    
    function startProgressUpdates() {
        if (intervalId) {
            clearInterval(intervalId);
        }
        
        const effectiveTimestamp = startTimestamp || songData?.timestamp;
        if (songData && songData.duration && effectiveTimestamp && autoUpdateProgress) {
            // Initial position calculation
            updateProgress();
            
            // Update every 100ms for smooth progress
            intervalId = setInterval(updateProgress, 100);
        }
    }
    
    function stopProgressUpdates() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        currentPosition = 0;
    }
    
    // Watch for song data changes and auto-update setting
    $: {
        const effectiveTimestamp = startTimestamp || songData?.timestamp;
        if (songData && songData.duration && effectiveTimestamp) {
            if (autoUpdateProgress) {
                startProgressUpdates();
            } else {
                stopProgressUpdates();
                // Set initial position based on timestamp when auto-update is disabled
                if (songData.position !== undefined) {
                    currentPosition = songData.position;
                } else {
                    const elapsed = (Date.now() - effectiveTimestamp) / 1000;
                    currentPosition = Math.min(elapsed, songData.duration);
                }
            }
        } else {
            stopProgressUpdates();
        }
    }
    
    onDestroy(() => {
        stopProgressUpdates();
    });
</script>

{#if songData}
    <div class="music-card">
        {#if songData.thumbnail}
            <div class="album-art-container">
                {#key `${songData.title}-${songData.artist}-${songData.timestamp}-${forceRefresh}`}
                    <img 
                        src="{songData.thumbnail}?t={songData.timestamp}&r={forceRefresh}" 
                        alt="Album Art" 
                        class="album-art"
                        class:loaded={imageLoaded}
                        on:load={() => imageLoaded = true}
                        on:error={() => imageLoaded = false}
                    />
                {/key}
                {#if !imageLoaded}
                    <div class="album-art-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 18V5l12-2v13"></path>
                            <circle cx="6" cy="18" r="3"></circle>
                            <circle cx="18" cy="16" r="3"></circle>
                        </svg>
                    </div>
                {/if}
            </div>
        {/if}
        <div class="song-info">
            <div class="song-details">
                <h3 class="song-title">{songData.title}</h3>
                <p class="song-artist">by {songData.artist}</p>
                {#if songData.album}
                    <p class="song-album">on {songData.album}</p>
                {/if}
            </div>
            
            {#if songData.duration}
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: {(currentPosition / songData.duration) * 100}%"></div>
                        <div class="progress-thumb" style="left: {(currentPosition / songData.duration) * 100}%"></div>
                    </div>
                    <div class="time-info">
                        <span class="current-time">{formatTime(currentPosition)}</span>
                        <span class="total-time">{formatTime(songData.duration)}</span>
                    </div>
                </div>
            {/if}
            
            {#if songData.url}
                <a href="{songData.url}" target="_blank" rel="noopener noreferrer" class="song-link">Listen on YouTube Music</a>
            {/if}
        </div>
    </div>
{:else}
    <div class="no-music">
        <p>Not listening to anything right now. :(</p>
    </div>
{/if}

<style lang="scss">
    @import '_config.scss';

    .music-card {
        display: flex;
        align-items: flex-start;
        background: #151516b9;
        border-radius: 12px;
        padding: 16px;
        max-width: 100%;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        border: 1px solid #42464d;
        gap: 12px;
    }

    .album-art-container {
        position: relative;
        width: 80px;
        height: 80px;
        flex-shrink: 0;
        border-radius: 8px;
        overflow: hidden;
    }

    .album-art {
        width: 100%;
        height: 100%;
        border-radius: 8px;
        object-fit: cover;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
    }

    .album-art.loaded {
        opacity: 1;
    }

    .album-art-placeholder {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #2f3136;
        color: #80848e;
        border-radius: 8px;
    }

    .song-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .song-details {
        flex: 1;
    }

    .song-title {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
        line-height: 1.2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .song-artist {
        margin: 2px 0 0 0;
        font-size: 12px;
        color: #b5bac1;
        line-height: 1.2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .song-album {
        margin: 2px 0 0 0;
        font-size: 12px;
        color: #80848e;
        line-height: 1.2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .progress-container {
        margin-top: 4px;
    }

    .progress-bar {
        position: relative;
        width: 100%;
        height: 6px;
        background: #4f545c;
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 4px;
    }

    .progress-fill {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background: linear-gradient(90deg, $primary-color 0%, $secondary-color 100%);
        border-radius: 3px;
        transition: width 0.2s cubic-bezier(0.2, 0, 0, 1);
    }

    .progress-thumb {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 12px;
        height: 12px;
        background: #ffffff;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        transition: left 0.2s cubic-bezier(0.2, 0, 0, 1);
        opacity: 0;
    }

    .progress-bar:hover .progress-thumb {
        opacity: 1;
    }

    .time-info {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        color: #80848e;
        font-weight: 500;
    }

    .song-link {
        display: inline-block;
        margin-top: 6px;
        color: #00aff4;
        text-decoration: none;
        font-size: 12px;
        font-weight: 500;
        transition: color 0.15s ease;
    }

    .song-link:hover {
        color: #0099d4;
        text-decoration: underline;
    }

    .no-music {
        background: #151516b9;
        border-radius: 12px;
        padding: 16px;
        max-width: 100%;
        text-align: center;
        color: #b5bac1;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        border: 1px solid #42464d;
    }

    .no-music p {
        margin: 0;
        font-size: 14px;
    }
</style>