<script>
	import Header from './Header.svelte';
	import './styles.css';
</script>

<svelte:head>
	<link rel="icon" href="https://media.piny.dev/Piny.png"/>
</svelte:head>

<div class="app">
	<Header />

	<main>
		<slot />
	</main>

	<footer>
		<p style="margin: 0;">Icons from <a href="https://tabler.io/icons">Tabler</a> + <a href="https://fonts.google.com/icons">Material symbols</a></p>
		<p style="margin-top: 0;">Made with ❤️ (and svelte) by Piny</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
