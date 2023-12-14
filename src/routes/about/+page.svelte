<svelte:head>
	<title>Piny - About</title>
	<meta name="description" content="About me or something idk" />
</svelte:head>

<div class="text-column">
	<h1>About me</h1>

	<p>
		Hi I'm Piny a fullstack(ish) javascript developer. I started actually programming in April 2022 when a big discord bot introduced NFTs and i thought it cant be that hard to make a bot that doesnt suck so i started learning javascript with discord.js and i made <a href="https://daalbot.xyz">DaalBot</a> which is still one of my main projects to this day with over {daalbotGuildCount} servers. During my time ive also done a few side projects but im not going to explain that here you should check out my projects page for that.<br/><br/>I have always been interested in technical things and started out doing redstone in minecraft which turned into making maps with fortnite creative and now i do coding. My goal has always been to make things that i would actually use and allow others to use and modify them if they want without paying a single penny. I also like to make things that arent really useful but are just fun to use like my games website with such hits as Rickrolldle and Rickrolldle 2: Electric Boogaloo.
	</p>
</div>

<script>
	import { browser } from "$app/environment";
	let daalbotGuildCount = 0;

	if (browser) {
		fetch("https://api.daalbot.xyz/get/general/serverAmount")
			.then(res => res.text())
			.then(data => {
				daalbotGuildCount = parseInt(data);
			});
	}
</script>