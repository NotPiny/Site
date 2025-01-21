<script>
    import { onMount } from "svelte";

    /**
     * @type {{ip: string, city_name: string, region_name: string}}
     */
    let ipRes;

    onMount(async () => {
        // Set the IP address to the users IP address.
        ipRes = await fetch("/api/get-ip").then(res => res.json());
    })
</script>

<svelte:head>
    <title>Anyways i have the fancier text so</title>
    <meta name="description" content="I'm better than you" />
</svelte:head>

<h1>Hello Mx {ipRes?.ip ?? '[HACKING THE MAINFRAME]'}</h1>
<p>So why dont you tell me what its like living in {ipRes?.city ?? 'that place'} no really what is it like ive never been to {ipRes?.region_name ?? 'that region'} before</p>

<p>Oh and by the way your IP address is {ipRes?.ip ?? '[LOADING INJECTOR]'} if you havent already noticed that i have your ip now</p>