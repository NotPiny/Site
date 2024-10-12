<script>
    import { onMount } from "svelte";
    import bookmarklets from "$lib/data/bookmarklets.json";
    /**
     * @type {{ name: string; bookmarklets: { name: string; description: string; id: string; uri: string; devkit: string; category: string; }[]; }[]}
    */
    let categories = [];
    let userAgent = '';

    /**
     * Converts a bookmarklet ID to a URI
     * @param {string} id
    */
    async function idToURI(id) {
        async function getSource() {
            const dev = import.meta.env.DEV;
            const urlTemplate = dev ? `http://localhost:5173/bookmarklets/source/bookmarklet/[_ID_].js` : `https://cdn.jsdelivr.net/gh/NotPiny/Site/static/bookmarklets/source/bookmarklet/[_ID_].js`;
            const url = urlTemplate.replace("[_ID_]", id);
            const response = await fetch(url);
            const source = await response.text();
            return source;
        }

        return `javascript:${await getSource()}`
    }

    let sourceReady = false;
    onMount(async() => {
        userAgent = navigator.userAgent;
        let sourcesAdded = 0;
        for (let i = 0; i < bookmarklets.length; i++) {
            const bookmarklet = bookmarklets[i];
            bookmarklet.uri = await idToURI(bookmarklet.id);

            // Jank asf but it works
            if (!categories.find(category => category.name === bookmarklet.category) && bookmarklet.category) {
                categories.push({
                    name: bookmarklet.category,
                    bookmarklets: [bookmarklet]
                });
            } else if (bookmarklet.category) {
                const category = categories.find(category => category.name === bookmarklet.category);
                if (!category) continue;
                if (!category.bookmarklets.find(b => b.id === bookmarklet.id)) {
                    category.bookmarklets.push(bookmarklet);
                }
            } else if (!categories.find(category => category.name === "Uncategorized")) {
                categories.push({
                    name: "Uncategorized",
                    bookmarklets: [bookmarklet]
                });
            } else {
                const category = categories.find(category => category.name === "Uncategorized");
                if (!category) continue;
                if (!category.bookmarklets.find(b => b.id === bookmarklet.id)) {
                    category.bookmarklets.push(bookmarklet);
                }
            }

            sourcesAdded++;

            if (sourcesAdded === bookmarklets.length) {
                sourceReady = true;
            }
        }
    })
</script>

<h1>Bookmarklets</h1>
<p style="text-align: center;">Drag the install button to the bookmarks bar to install bookmarklets</p>
{#if userAgent.includes("Firefox")}
<span id="firefox-warning">
    <b>Hey! </b>it seems you're using firefox, just a heads up, all though you can try to install these bookmarklets they are primarily designed for Chromium based browsers.
</span>
{/if}
<div id="category-list">
    {#if sourceReady}
    {#each categories as category}
        <h2>{category.name}</h2>
        <div id="bookmarklet-grid">
            {#each category.bookmarklets as bookmarklet}
            <div class="bookmarklet">
                <h2>{bookmarklet.name}</h2>
                <p>{bookmarklet.description}</p>
                <span class="button-split">
                    <a href={bookmarklet.uri}>
                        Install
                    </a>
                    <a href="/bookmarklets/{bookmarklet.id}">More info</a>
                </span>
            </div>
            {/each}
        </div>
    {/each}
    {/if}
    {#if !sourceReady}
    <h1>Loading...</h1>
    {/if}
</div>

<svelte:head>
    <title>Piny - Bookmarklets</title>
    <meta name="description" content="A collection of bookmarklets that I have made"/>
</svelte:head>

<style>
    #bookmarklet-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
    }

    .bookmarklet {
        padding: 1rem;
        border: 1px solid #000;
        border-radius: 7px;

        background-color: #2a2a2a;
        color: white;
    }

    .bookmarklet h2 {
        font-size: 1.2em;
        font-weight: bolder;
    }

    .button-split {
        /* Fill the space with the buttons */
        display: flex;
        justify-content: space-between;

        gap: .75rem;
    }

    .bookmarklet a {
        display: block;
        padding: 0.5rem;
        background-color: #1e1e1e;
        color: #fff;
        text-align: center;
        border-radius: 5px;
        text-decoration: none;

        width: 45%;
    }

    .bookmarklet a:hover {
        transition: all 0.3s;
        background-color: #2e2e2e;
    }

    #firefox-warning {
        display: block;
        margin-bottom: 1rem;
        padding: 1rem;
        background-color: darkred;
        color: white;
        border-radius: 5px;
    }
</style>