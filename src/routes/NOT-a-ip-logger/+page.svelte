<script>
    import { onMount } from "svelte";

    let ip = ""; // This is a fake IP address. Just incase it cant load the real one.

    /**
     * @type {{ip: string, city_name: string, region_name: string}}
     */
    let ipRes;

    onMount(async () => {
        // Set the IP address to the users IP address.
        ipRes = await fetch("https://api.ipify.org?format=json").then(res => res.json());
        ip = ipRes.ip;

        ipRes = await fetch(`/api/get-ip?ip=${ip}`).then(res => res.json());
    })
</script>

<svelte:head>
    <title>Anyways i have the fancier text so</title>
    <meta name="description" content="I'm better than you" />
</svelte:head>

<h1>Hello Mx {ip}</h1>
<p>So why dont you tell me what its like living in {ipRes?.city_name} no really what is it like ive never been to {ipRes?.region_name} before</p>

<p>Oh and by the way your IP address is {ip} if you havent already noticed that i have your ip now</p>