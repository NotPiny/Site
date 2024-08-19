<svelte:head>
	<title>Piny - About</title>
	<meta name="description" content="About me or something idk" />
</svelte:head>

<div class="text-column">
	<h1>About me</h1>

	<p>
		Hi, I'm Piny, a full-stack JavaScript developer. I started actually programming in April 2022 when a big Discord bot introduced NFTs. I thought it can't be that hard to make a bot that doesn't suck, so I started learning JavaScript with Discord.js. I made <a href="https://daalbot.xyz">DaalBot</a>, which is still one of my main projects to this day with over {daalbotGuildCount} servers. During my time, I've also done a few side projects, but I'm not going to explain that here. You should check out my projects page for that.
		<br/><br/>
		I have always been interested in technical things and started out doing redstone in Minecraft, which turned into making maps with Fortnite Creative, and now I do coding. My goal has always been to make things that I would actually use and allow others to use and modify them if they want without paying a single penny. I also like to make things that aren't really useful but are just fun to use, like my games website with such hits as Rickrolldle and Rickrolldle 2: Electric Boogaloo.
	</p>
</div>

<script>
    import { onMount } from "svelte";

	let daalbotGuildCount = 72; // Not gonna be fully up-to-date, but it's just a placeholder while fetching the real value from the API later on
	
	onMount(() => {
		fetch("https://api.daalbot.xyz/get/general/serverAmount")
			.then(res => res.text())
			.then(data => {
				daalbotGuildCount = parseInt(data);
			});
	})
</script>
<style>
	.text-column {
		display: flex;
		flex-direction: column;
	}
</style>