<script>
	import Typewriter from "../components/Typewriter.svelte";
</script>

<svelte:head>
	<title>Piny - Home</title>
	<meta name="description" content="The home page." />
</svelte:head>

<section>
	<h1>Piny</h1>

	<pre>
		<Typewriter
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
				"OwO",
				"What's this?",
				"Why are you still here?",
				"Well if you are still reading this",
				"You might as well follow me on github (NotPiny)",
				"Or check out my projects (/projects)",
				"Alright, I'm done now",
				"I'll be back when the loop is over",
				"Bye!",
			]}
		/>
	</pre>

	<h2>Links:</h2>
	<div class="link-section">
		<a href="https://discord.com/users/900126154881646634">Discord</a>
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
