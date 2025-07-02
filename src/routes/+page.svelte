<script>
    import { onMount } from "svelte";
	import githubIcon from '$lib/images/github.svg';
	import discordIcon from '$lib/images/discord-mark-white.svg';
	import blueskyIcon from '$lib/images/bsky.svg';
	import clockIcon from '$lib/images/clock.svg';
	import playlistIcon from '$lib/images/playlist.svg';
	import desktopStatusIcon from '$lib/images/status/desktop.svg';
	import mobileStatusIcon from '$lib/images/status/mobile.svg';
	import offlineStatusIcon from '$lib/images/status/offline.svg';
	import { browser } from "$app/environment";
	let desktopStatusIconSVG = '';
	let mobileStatusIconSVG = '';

	const subtitlePool = [
		'Hobbyist Web / Bot Developer',
		'Professional Idiot',
		'Very good at breaking things',
		'Somehow still alive',
		'Meandering',
		'Writes jokes instead of being productive',
		'Hoping nothing breaks in my sleep',
		'Tinkering with designs',
		'Designer at times, Artist at other times',
		'Random person on the web',
		'I use arch btw',
		'Writes code that breaks itself',
		'Having fun around the sheep',
		'ITS PRONOUNCED /pɪn iː/',
		'God knows I\'ll live forever or diе in the attempt'
	]

	let currentTime = new Date().toLocaleTimeString('en-GB', {
		timeZone: 'Europe/London',
		hour: '2-digit',
		hour12: false,
		minute: '2-digit'
	});

	// Wait until the end of the current minute
	let timeToWait = 60000 - (new Date().getTime() % 60000);

	setTimeout(() => {
		currentTime = new Date().toLocaleTimeString('en-GB', {
			timeZone: 'Europe/London',
			hour: '2-digit',
			hour12: false,
			minute: '2-digit'
		});
		setInterval(() => {
			currentTime = new Date().toLocaleTimeString('en-GB', {
				timeZone: 'Europe/London',
				hour: '2-digit',
				hour12: false,
				minute: '2-digit'
			});
		}, 60000);
	}, timeToWait);

	/**
	 * @type {{id: string, name: "Youtube Music", state: string, session_id: string, details: string, application_id: string, timestamps: { start: number, end: number }, assets: { large_image: string, large_text: string, small_image: string, small_text: string, buttons: ["Play on Youtube Music", "Play on Youtube Music Desktop"], created_at: number }}}
	 */
	let currentMusicActivity = {
        id: "",
        name: "Youtube Music",
        state: "",
        session_id: "",
        details: "",
        application_id: "",
        timestamps: {
            start: 0,
            end: 0
        },
        assets: {
            large_image: "",
            large_text: "",
            small_image: "",
            small_text: "",
            buttons: [
				"Play on Youtube Music",
				"Play on Youtube Music Desktop"
			],
            created_at: 0
        }
    };
	/**
	 * @type {{state: {id: string, title: string, author: string, cover: string, duration: number}, time: number, type: number}}
	*/
	let currentMusicData = {
        state: {
            id: "",
            title: "",
            author: "",
            cover: "",
			duration: 0
        },
        time: 0,
        type: 0
    };
	let currentMusicDataUpdated = false;
	let currentMusicProgress = 0;
	let currentMusicProgressHuman = 0; // In seconds (for 1:23/4:56 formatting)

	/**
	 * @type {{ history: Array<{state: {id: string, title: string, author: string, cover: string, duration: number}, time: number, type: number}> }}
	 */
	let musicHistory = { history: [] };
	let isListening = false;

	let discord_status = 'offline';

	setInterval(() => {
		if (!isListening || !currentMusicActivity?.timestamps?.start) return;
		
		const elapsed = Date.now() - currentMusicActivity.timestamps.start;
		const durationMs = currentMusicActivity.timestamps.end - currentMusicActivity.timestamps.start;

		currentMusicProgress = Math.min((elapsed / durationMs) * 100, 100);

		currentMusicProgressHuman = Math.floor(elapsed / 1000);
	}, 500);

	let headerSubtitleFull = subtitlePool[Math.floor(Math.random() * subtitlePool.length)];
	let headerSubtitle = ' '.repeat(headerSubtitleFull.length);

	let speed = 100;

	onMount(async() => {
		const urlParams = new URLSearchParams(window.location.search);
		speed = parseInt(urlParams.get('speed') ?? '100');

		(async() =>{ // Move the subtitle and api requests to a different function so it doesn't block the rest of the code
			fetch(desktopStatusIcon).then(res => res.text()).then(text => {
				desktopStatusIconSVG = text;
			});

			fetch(mobileStatusIcon).then(res => res.text()).then(text => {
				mobileStatusIconSVG = text;
			});

			for (let i = 0; i < headerSubtitleFull.length; i++) {
				await new Promise((resolve) => setTimeout(resolve, speed));
				headerSubtitle = headerSubtitle.substring(0, i) + headerSubtitleFull[i] + headerSubtitle.substring(i + 1);
			}
		})();


		// Create WebSocket connection.
		const socket = new WebSocket("wss://api.lanyard.rest/socket");

		// Listen for messages
		socket.addEventListener("message", (event) => {
			const data = JSON.parse(event.data);

			if (data.op == 1) {
				socket.send(JSON.stringify({
					op: 2,
					d: {
						subscribe_to_id: "900126154881646634"
					}
				}))

				setInterval(() => {
					socket.send(JSON.stringify({
						op: 3
					}))
				}, data.d.heartbeat_interval)
			}

			discord_status = data.d.discord_status;

			/**
			 * @type {HTMLSpanElement | null}
			 */
			const statusElement = document.querySelector('.status');
			if (statusElement) (async() => {
				statusElement.innerHTML = '';
				let targetColour = '';

				if (data.d.discord_status == 'online') targetColour = '#23a55a';
				if (data.d.discord_status == 'dnd') targetColour = '#f23f43';
				if (data.d.discord_status == 'idle') targetColour = '#f0b232';

				if (data.d.discord_status == 'offline')
					return statusElement.innerHTML = `<img src="${offlineStatusIcon}" alt="Offline Status Indicator" unselectable="on" draggable="false">`;

				while (!desktopStatusIconSVG || !mobileStatusIconSVG) await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for the icons to load

				if (data.d.active_on_discord_desktop)
					statusElement.innerHTML += desktopStatusIconSVG.replace('currentColor', targetColour);

				if (data.d.active_on_discord_mobile)
					statusElement.innerHTML += mobileStatusIconSVG.replace('currentColor', targetColour);
			})();

			// @ts-ignore
			currentMusicActivity = data.d?.activities?.find(activity => activity.name == 'YouTube Music'); // Youtube Music desktop app discord activity

			if (!currentMusicActivity) return isListening = false;
			else isListening = true;

			async function updateMusicData(rd = 1000) {
				try {
					console.debug('Updating music data...');
					console.debug('Current activity:', currentMusicActivity);

					const mhReq = await fetch(`/api/music/history`);
					musicHistory = await mhReq.json();
					console.debug('Music history:', musicHistory);

					// @ts-ignore
					currentMusicData = musicHistory.history.find(data => data.state.title == currentMusicActivity.details);
					console.debug('Found music data:', currentMusicData);

					// If no match found, check if currentMusicActivity has the required data
					if (!currentMusicData && currentMusicActivity.details) {
						const imageUrl = currentMusicActivity.assets?.large_image || "";
						const cleanedImageUrl = imageUrl.includes('mp:external') 
							? imageUrl.split('/https/')[1].split('?')[0] // Extract the actual URL
							: imageUrl;

						currentMusicData = {
							state: {
								id: currentMusicActivity.state || "",
								title: currentMusicActivity.details || "",
								author: currentMusicActivity.state || "",
								cover: `https://${cleanedImageUrl}`, // Prepend https://
								duration: currentMusicActivity.timestamps?.end ? 
									(currentMusicActivity.timestamps.end - currentMusicActivity.timestamps.start) / 1000 : 0
							},
							time: Date.now(),
							type: 0
						};
					}

					if (!currentMusicData) {
						console.debug('No music data found');
						currentMusicDataUpdated = false;
						return;
					}

					currentMusicDataUpdated = true;
					console.debug('Updated music data:', currentMusicData);
				} catch (error) {
					console.error('Error updating music data:', error);
					setTimeout(() => updateMusicData(rd + 750), rd + Math.random() * 500);
				}
			}

			updateMusicData();

			// Add this console log in your WebSocket message handler
			console.log({
				musicData: currentMusicData,
				progress: currentMusicProgress,
				backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), linear-gradient(90deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.9) ${currentMusicProgress}%), url(${currentMusicData.state.cover.replace('w60-h60', 'w500-h500')})`
			});
		});
	});
</script>

<svelte:head>
	<title>Piny - Home</title>
	<meta name="description" content="The home page." />
	<link rel="preconnect" href="https://cdn.jsdelivr.net">
	<link rel="preconnect" href="https://api.lanyard.rest">
	<link rel="preconnect" href="https://media.piny.dev">
</svelte:head>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<section>
	<div class="header">
		<div class="header-name">
			<h1>Piny</h1>
			<span class="status" title="Discord Status Indicator (Currently {discord_status})">
				<img src={offlineStatusIcon} alt="Offline Status Indicator" unselectable="on" draggable="false">
			</span>
		</div>
		<div class="header-description">
			<p><pre style="background-color: transparent; outline: none; box-shadow: none;" id="header-subtitle">{headerSubtitle}</pre>
		</div>
		<div class="info-row">
			<a href="https://time.is/London" target="_blank" class="labelled">
				<img src="{clockIcon}" alt="Clock Icon" width=26 height=26 unselectable="on" draggable="false" color="#ffffff">
				<p>{currentTime}</p>
			</a>
			<a href="https://github.com/NotPiny" target="_blank"><img src="{githubIcon}" alt="Github Logo" width=26 height=26 unselectable="on" draggable="false" color="#ffffff"></a>
			<a href="https://discordlookup.com/user/900126154881646634" target="_blank"><img src="{discordIcon}" alt="Discord Logo" width=26 height=26 unselectable="on" draggable="false"/></a>
			<a href="https://bsky.app/profile/piny.dev" target="_blank"><img src="{blueskyIcon}" alt="Bluesky Logo" width=26 height=26 unselectable="on" draggable="false" color="#ffffff"></a>
			{#if isListening}
			<a href="https://music.youtube.com/watch?v={currentMusicData.state.id}" 
				target="_blank" 
				class="labelled ytm-card" 
				style="background: linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), 
					linear-gradient(90deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.9) {currentMusicProgress}%), 
					url({currentMusicData.state.cover}) center/cover;">
				<div style="display: flex; flex-direction: column;">
					<p>{currentMusicData.state.title.substring(0, 32)}{currentMusicData.state.title.length > 32 ? '...' : ''}</p>
					<div class="ytm-card-meta">
						<p style="margin-right: 1em;">{currentMusicData.state.author}</p>
						<p>{Math.floor(currentMusicProgressHuman / 60)}:{(currentMusicProgressHuman % 60).toString().length == 2 ? currentMusicProgressHuman % 60 : `0${currentMusicProgressHuman % 60}`}/{Math.floor(currentMusicData.state.duration / 60)}:{(currentMusicData.state.duration % 60).toString().length == 2 ? currentMusicData.state.duration % 60 : `0${currentMusicData.state.duration % 60}`}
					</div>
				</div>
			</a>
			{:else}
				<!-- Must be a valid link 😭 -->
				<a href="/" class="labelled ytm-card">
					<img src={playlistIcon} alt="Music Icon" width=26 height=26 unselectable="on" draggable="false" color="#ffffff">
					<p>Not listening</p>
				</a>
			{/if}
		</div>
	</div>

	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<h1 style="cursor: pointer;" id="projects-area-heading" on:mouseenter={() => {
		/**
		 * @type {HTMLDivElement | null}
		 */
		const chevron = document.querySelector('.material-symbols-outlined');
		if (!chevron) return;
		
		chevron.style.transition = 'transform 0.5s';
		// Move the chevron to the right and scale it up
		chevron.style.transform = 'translateX(10px) scale(1.5)';

		/**
		 * @type {HTMLHeadingElement | null}
		*/
		// @ts-ignore
		const heading = document.getElementById('projects-area-heading');
		if (!heading) return;

		heading.style.transition = 'color 0.5s';
		heading.style.color = '#fff';
	}}
	on:mouseleave={() => {
		/**
		 * @type {HTMLDivElement | null}
		 */
		const chevron = document.querySelector('.material-symbols-outlined');
		if (!chevron) return;
		
		chevron.style.transition = 'transform 0.5s';
		// Move the chevron back to the left
		chevron.style.transform = 'translateX(0)';

		/**
		 * @type {HTMLHeadingElement | null}
		*/
		// @ts-ignore
		const heading = document.getElementById('projects-area-heading');
		if (!heading) return;

		heading.style.transition = 'color 0.5s';
		heading.style.color = 'rgba(255, 255, 255, 0.7)';
	}}
	on:click={() => {
		window.location.href = '/projects';
	}}
	>Projects <span class="material-symbols-outlined" style="
		display: inline-flex;
		justify-content: center;
		align-items: center;
		font-size: 2rem;
		position: relative;
		bottom: 2.5px;
		color: rgba(255, 255, 255, 0.7);
	">
		>
	</span>
	</h1>
	<div class="project-list">
		<ul>
			<li>
				<div class="project-header">
					<h2>DaalBot</h2>
					<img src="https://media.piny.dev/DaalBotSquare.png" alt="DaalBot Logo" width="32" height="32" unselectable="on" draggable="false">
				</div>
				<div class="project-description">
					<p style="margin: 0; margin-top: 5px;">DaalBot is a free and open source Discord bot designed to be infinitely customisable. Written in javascript using discord.js</p>
				</div>
			</li>
			<li>
				<div class="project-header">
					<h2>Candy</h2>
					<img src="https://media.piny.dev/candy/pfp.png" alt="Candy Logo" width="32" height="32" unselectable="on" draggable="false">
				</div>
				<div class="project-description">
					<p style="margin: 0; margin-top: 5px;">Candy is a free and open source Discord user app designed to enchance the discord experience.</p>
				</div>
			</li>
		</ul>
	</div>
</section>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="action-director" on:click={() => {
	if (!browser) return;
	window.location.href = '/about';
}}><p>About</p> ></div>
<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
		text-align: left;
	}

	pre {
		height: 40px;

		display: flex;
		justify-content: center;
		align-items: center;

		font-size: 1.5rem;

		outline: black solid 1px;
	}

	.header {
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: start;

		gap: .25rem;

		margin-bottom: 1rem;

		width: 100%;
	}

	.header-name {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;

		gap: 1.75rem;
	}

	.header-name h1 {
		font-size: 5rem;
		font-style: italic;

		margin: 0;
	}

	.header-description {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;

		gap: 1rem;
	}

	.info-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;

		gap: 1rem;
	}

	.info-row a {
		display: flex;
		justify-content: center;
		align-items: center;

		gap: .5rem;

		border-radius: 50%;
		background-color: #2f2f2f;

		padding: 1rem;
	}

	.info-row a.labelled {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;

		gap: .5rem;

		border-radius: 5px;
		background-color: #2f2f2f;

		padding: 1rem;
	}

	.info-row a p {
		font-size: 1.5rem;
		font-weight: bold;
		color: white;

		margin: 0;
	}

	.ytm-card {
		height: 2em !important; /* It will steal all the space if we don't limit it */
		min-width: 25em !important;

		/* Outline the text for better readability */
		text-shadow: 0 0 5px black;

		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.ytm-card-meta {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.ytm-card-meta p {
		font-size: 1.25rem !important;
		font-weight: lighter !important;
		color: #808080 !important;

		margin: 0;
	}

	.status {
		display: flex;
		justify-content: center;
		align-items: center;

		padding: 1rem;
		border-radius: 15%;
		background-color: #2f2f2f;

		gap: .5rem;

		font-weight: bold;
	}

	.status * {
		width: 2.5rem !important;
		height: 2.5rem !important;
	}

	.project-list {
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: start;

		width: 100%;
	}

	.project-list ul {
		list-style-type: none;

		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: start;

		gap: 1rem;
	}

	.project-list li {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		padding: 1rem;

		background-color: #2f2f2f;
	}

	.project-list li .project-header {
		display: flex;
		flex-direction: row;
		justify-content: start;
		align-items: start;

		width: 100%;

		gap: 1rem;
	}

	.project-list .project-header h2 {
		font-size: 1.3rem;
		font-weight: bold;
		color: white;
		text-align: left;

		margin: 0;
	}

	.action-director {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;

		gap: .35rem;

		cursor: pointer;
	}
</style>
