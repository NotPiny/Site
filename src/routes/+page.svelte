<script>
    import { onMount } from "svelte";
	import githubIcon from '$lib/images/github.svg';
	import discordIcon from '$lib/images/discord-mark-white.svg';
	import blueskyIcon from '$lib/images/bsky.svg';
	import clockIcon from '$lib/images/clock.svg';
	import playlistIcon from '$lib/images/playlist.svg';
    import { browser } from "$app/environment";
	let statusEmoji = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f503.svg'; // 🔃
	let statusEmojiUnicode = '🔃';
	let statusText = 'Loading...';

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
		'Having fun around the sheep'
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

	let currentMusicActivity = {};
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
	/**
	 * @type {{ history: Array<{state: {id: string, title: string, author: string, cover: string, duration: number}, time: number, type: number}> }}
	 */
	let musicHistory = { history: [] };
	let isListening = false;

	let headerSubtitleFull = subtitlePool[Math.floor(Math.random() * subtitlePool.length)];
	let headerSubtitle = ' '.repeat(headerSubtitleFull.length);

	let speed = 100;

	onMount(async() => {
		const urlParams = new URLSearchParams(window.location.search);
		speed = parseInt(urlParams.get('speed') ?? '100');

		(async() =>{ // Move the subtitle to a different function so it doesn't block the rest of the code
			for (let i = 0; i < headerSubtitleFull.length; i++) {
				await new Promise((resolve) => setTimeout(resolve, speed));
				headerSubtitle = headerSubtitle.substring(0, i) + headerSubtitleFull[i] + headerSubtitle.substring(i + 1);
			}
		})();

		// Create WebSocket connection.
		const socket = new WebSocket("wss://api.lanyard.rest/socket");

		// Listen for messages
		socket.addEventListener("message", (event) => {
			console.log("Message from server ", event.data);

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

			const status = data.d?.discord_status;

			switch (status) {
				case 'online':
					statusEmoji = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f315.svg'; // 🌕
					statusEmojiUnicode = '🌕';
					statusText = 'Online';
					break;
				case 'idle':
					statusEmoji = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f319.svg'; // 🌙
					statusEmojiUnicode = '🌙';
					statusText = 'Idle';
					break;
				case 'dnd':
					statusEmoji = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f6ab.svg'; // 🚫
					statusEmojiUnicode = '🚫';
					statusText = 'Do Not Disturb';
					break;
				case 'offline':
					statusEmoji = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f311.svg'; // 🌑
					statusEmojiUnicode = '🌑';
					statusText = 'Offline';
					break;
			}

			// @ts-ignore
			currentMusicActivity = data.d?.activities?.find(activity => activity.name == 'YouTube Music'); // Youtube Music desktop app discord activity

			if (!currentMusicActivity) return isListening = false;
			else isListening = true;

			(async()=>{
				const mhReq = await fetch(`/api/music/history`);
				musicHistory = await mhReq.json();

				// @ts-ignore
				currentMusicData = musicHistory.history.find(data => data.state.title == currentMusicActivity.details) ?? {
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

				if (!currentMusicData.state.id) {
					currentMusicDataUpdated = false;
				}

				console.log(currentMusicData);

				const musicWidget = document.querySelector('.ytm-card');
				if (!musicWidget) return;
			})();
		});
	});
</script>

<svelte:head>
	<title>Piny - Home</title>
	<meta name="description" content="The home page." />
	<link rel="preconnect" href="https://cdn.jsdelivr.net">
</svelte:head>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<section>
	<div class="header">
		<div class="header-name">
			<h1>Piny</h1>
			<span class="status">
				<img src="{statusEmoji}" alt="{statusEmojiUnicode}" width="30" height="30" unselectable="on" draggable="false">
				{statusText}
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
				<a href="https://music.youtube.com/watch?v={currentMusicData.state.id}" target="_blank" class="labelled ytm-card" style="background-image: linear-gradient( rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25) ), url({currentMusicData.state.cover.replace('w60-h60', 'w500-h500')}); background-size: cover; background-position: center;">
					<img src={playlistIcon} alt="Music Icon" width=26 height=26 unselectable="on" draggable="false" color="#ffffff">
					<p>{currentMusicData.state.title} - {currentMusicData.state.author}</p>
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

		border-radius: 5%;
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

		/* Outline the text for better readability */
		text-shadow: 0 0 5px black;
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
