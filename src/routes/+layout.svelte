<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
    import { onMount } from 'svelte';

	let { children } = $props();

	const pageOrder = ['home', 'about', 'projects'];

	function smoothlySetOpacity(element: HTMLElement, targetOpacity: number, duration: number) {
		const initialOpacity = parseFloat(getComputedStyle(element).opacity);
		const opacityChange = targetOpacity - initialOpacity;
		const startTime = performance.now();

		function animate(time: number) {
			const elapsed = time - startTime;
			const progress = Math.min(elapsed / duration, 1);
			element.style.opacity = (initialOpacity + opacityChange * progress).toString();

			if (progress < 1) {
				requestAnimationFrame(animate);
			}
		}

		requestAnimationFrame(animate);
	}

	onMount(() => {
		let scrolling = false;
		let lastScrolled = 0;
		window.addEventListener("scroll", () => {
			scrolling = true;
			lastScrolled = Date.now();
			setTimeout(() => {
				if (Date.now() - lastScrolled >= 100) scrolling = false;
			}, 100);
		});

		window.addEventListener("wheel", event => {
			const delta = Math.sign(event.deltaY);
			console.info(delta);

			if (event.ctrlKey) return;
			if (event.shiftKey) return;
			if (event.altKey) return;
			if (event.metaKey) return;

			const page = document.querySelector('.page');
			if (!page) return;
			if (scrolling) return;

			setTimeout(() => {
				if (scrolling) return;

				if (delta > 0) {
					smoothlySetOpacity(page as HTMLElement, 0, 300);
					setTimeout(() => {
						const currentPath = window.location.pathname.slice(1) || 'home';
						const currentIndex = pageOrder.indexOf(currentPath);
						const nextIndex = (currentIndex + 1) % pageOrder.length;
						window.location.href = `/${pageOrder[nextIndex] === 'home' ? '' : pageOrder[nextIndex]}`;
					}, 300);
				} else {
					smoothlySetOpacity(page as HTMLElement, 0, 300);
					setTimeout(() => {
						const currentPath = window.location.pathname.slice(1) || 'home';
						const currentIndex = pageOrder.indexOf(currentPath);
						const prevIndex = (currentIndex - 1 + pageOrder.length) % pageOrder.length;
						window.location.href = `/${pageOrder[prevIndex] === 'home' ? '' : pageOrder[prevIndex]}`;
					}, 300);
				}

				// Automatically snap to the top or bottom of the new page (scroll up = bottom, scroll down = top)
				//! This is borked, fix it
				setTimeout(() => {
					if (delta > 0) {
						window.scrollTo({ top: 0, behavior: 'smooth' });
					} else {
						window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
					}
				}, 300);
			}, 50); // Make sure scrolling has been registered
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Piny</title>
	<meta name="description" content="Heya! I'm Ember (or Piny[/pɪn iː/]), a hobbyist developer and (somewhat) graphic designer, and well this is my site." />
</svelte:head>

<nav>
	<a href="/">Home</a>
	<a href="/about">About</a>
	<a href="/projects">Projects</a>
</nav>

<div class="page">
	{@render children?.()}
</div>

<footer>
	<div class="left">
		<p>Image from <a href="https://unsplash.com">Unsplash</a></p>
	</div>
	<div class="center">
	</div>
	<div class="right">
		<p><a href="https://github.com/NotPiny">GitHub</a></p>
	</div>
</footer>

<style lang="scss">
	@use 'main';
</style>