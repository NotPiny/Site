<script>
    import { onMount } from "svelte";
	import githubIcon from '$lib/images/github.svg';
	import discordIcon from '$lib/images/discord-mark-white.svg';
	import blueskyIcon from '$lib/images/bsky.svg';
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
		'Random person on the web'
	]

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
		})()

		if (window.location.hostname === 'localhost') {
			// If we're on localhost, we're probably online developing, so we don't need to fetch the status
			statusEmoji = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f315.svg'; // 🌕
			statusEmojiUnicode = '🌕';
			statusText = 'Online';
			return;
		}
		
		const response = await fetch('https://api.statusbadges.me/presence/900126154881646634');
		const data = await response.json();

		switch (data.status) {
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
			<a href="https://github.com/NotPiny" target="_blank"><img src="{githubIcon}" alt="Github Logo" width=26 height=26 unselectable="on" draggable="false" color="#ffffff"></a>
			<a href="https://discordlookup.com/user/900126154881646634" target="_blank"><img src="{discordIcon}" alt="Discord Logo" width=26 height=26 unselectable="on" draggable="false"/></a>
			<a href="https://bsky.app/profile/piny.dev" target="_blank"><img src="{blueskyIcon}" alt="Bluesky Logo" width=26 height=26 unselectable="on" draggable="false" color="#ffffff"></a>
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

	.header-description a {
		display: flex;
		justify-content: center;
		align-items: center;

		border-radius: 50%;
		background-color: #2f2f2f;

		padding: 1rem;
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
