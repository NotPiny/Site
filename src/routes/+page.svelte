<script>
    import { browser } from "$app/environment";
	import Typewriter from "../components/Typewriter.svelte";

	let speed = 100;

	if (browser) {
		const urlParams = new URLSearchParams(window.location.search);
		speed = parseInt(urlParams.get('speed') ?? '100');
	}

	let discordDisplay = 'Discord';
</script>

<svelte:head>
	<title>Piny - Home</title>
	<meta name="description" content="The home page." />
</svelte:head>

<section>
	<h1>Piny</h1>

	<pre>
		<Typewriter
			externalDelay={speed}
			texts={[
				"Hello I'm Piny",
				"I can do fullstack javascript",
				"I am currently learning Svelte (and made this site with it :D)",
				"I can do some other stuff too",
				"Like HTML, CSS, Bash, Java and a tiny bit of Python",
				"Hello I'm Piny",
				"I can do fullstack javascript",
				"I am currently learning Svelte (and made this site with it :D)",
				"I can do some other stuff too",
				"Like HTML, CSS, Bash, Java and a tiny bit of Python",
				"<b>OwO</b>",
				"What's this?",
				"Why are you still here?",
				"Well if you are still reading this",
				"You might as well follow me on github (NotPiny)",
				"Or check out my projects (/projects)",
				"Alright, I'm done now",
				"I'll be back when the loop is over",
				"i dont thinkthid is wroking",
				"Bye!",
			]}
		/>
	</pre>

	<h2>Links:</h2>
	<div class="link-section">
		<a
		href="https://discord.com/users/900126154881646634"
		on:mouseenter={() => { discordDisplay = 'Discord (@piny.)' }}
		on:mouseleave={() => { discordDisplay = 'Discord' }}
		>{discordDisplay}</a>
		<a href="https://github.com/NotPiny">Github</a>
	</div>
</section>

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
	}

	pre {
		height: 40px;

		display: flex;
		justify-content: center;
		align-items: center;

		font-size: 1.5rem;

		outline: black solid 1px;
	}

	.link-section {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;

		width: 100%;
	}

	.link-section a {
		margin: 0.25rem;
		border-radius: 0.5rem;

		background-color: #aa3bad;
		color: white;

		padding: 0.5rem 1rem;
	}
</style>
