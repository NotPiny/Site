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

	<h1>Tools / Setup</h1>
	<p>
		I use a lot of things; however, here are some of the main things I use:
	</p>
	<ul>
		<li>Arch Linux - Pretty cool operating system if i do say so myself</li>
		<li>Visual Studio Code - My main code editor</li>
		<li>GitHub - Where I host my code</li>
		<li>Vercel - Where I deploy my sites</li>
		<li>Discord.js - For making Discord bots</li>
		<li>Svelte(kit) - For making websites</li>
		<li><small class="font-size: 0.7em">i use arch btw</small></li>
	</ul>

	<h1>Interests</h1>
	<p>
		Now it's time for some of my interests because why not. I like games, coding, and music. I play a lot of games, mostly Minecraft and Fortnite, but I also play other games like Rocket League.
		<br/><br/>
		Music: I listen to a lot of music, but according to YouTube Music, I listen to 46% indie, 13% pop, 10% rock, 2% French indie???, and 1% electronic dance.
		<br/><br/>
		Games: I play a few games, mostly Minecraft and Fortnite + Rocket League. I also play stuff like roblox and random games on steam occasionally.
		<br/><br/>
		Computers: I like computers and stuff related to them. I run Arch Linux on my main computer and have a dual-booted (SteamOS + Windows 10) SteamDeck OLED (1TB) for games that don't work on Linux (I'm looking at you Minecraft Bedrock / Fortnite) and stuff like Rocket League where I prefer to play on a controller.
	</p>
</div>

<script>
    import { onMount } from "svelte";

	let daalbotGuildCount = 84; // Not gonna be fully up-to-date, but it's just a placeholder while fetching the real value from the API later on
	
	onMount(() => { // Doesnt work?? / Look into
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
		flex-direction: left;
	}

	h1 {
		text-align: left;
		margin-bottom: 0;
	}
</style>