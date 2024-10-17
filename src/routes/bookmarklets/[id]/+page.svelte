<script>
    import { onMount } from 'svelte';
    import bookmarklets from '$lib/data/bookmarklets.json';
    export let data;

    let platform = 'desktop';
    let userAgent = 'unknown';

    let bookmarklet = bookmarklets.find(b => b.id === data.slug) ?? {
        name: "Bookmarklet not found",
        description: "The bookmarklet with the ID " + data.slug + " could not be found",
        id: 'not-found',
        uri: 'javascript:alert("The bookmarklet with the ID ' + data.slug + ' could not be found")',
        devkit: undefined
    };

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

    let editor;
    /**
     * Initiates the Monaco editor
     * @param {string} value
     */
    async function initiateMonacoEditor(value) {
        import('monaco-editor').then(monaco => {
            editor = monaco;
            // @ts-ignore
            monaco.editor.create(document.getElementById('editor'), {
                value: value ?? `Source code for the bookmarklet with the ID ${data.slug} could not be found`,
                language: 'javascript',
                theme: 'vs-dark',
                readOnly: true,
                minimap: {
                    enabled: false
                }
            });
        });
    }

    let sourceReady = false;
    onMount(async() => {
        userAgent = navigator.userAgent;
        platform = userAgent.match(/(Android|iPhone|iPad|iPod|iOS|Mobile)/i) ? 'mobile' : 'desktop';

        if (bookmarklet.id === 'not-found') {
            alert(`Something has gone terribly wrong, the bookmarklet with the ID ${data.slug} could not be found`);
            return window.location.href = '/bookmarklets';
        }

        bookmarklet.uri = await idToURI(bookmarklet.id);
        const source = await fetch(import.meta.env.DEV ? `http://localhost:5173/bookmarklets/source/raw/${bookmarklet.id}.js` : `https://cdn.jsdelivr.net/gh/NotPiny/Site/static/bookmarklets/source/raw/${bookmarklet.id}.js`);
        initiateMonacoEditor(await source.text());
        sourceReady = true;
    })
</script>

<h1>Bookmarklets / {bookmarklet.name}</h1>
<p style="text-align: center; margin-bottom: 1rem; margin-top: 0;">{bookmarklet.description}</p>
{#if userAgent.includes("Firefox")}
<span id="firefox-warning">
    <b>Hey! </b>it seems you're using firefox, just a heads up, all though you can try to install these bookmarklets they are primarily designed for Chromium based browsers.
</span>
{/if}

{#if sourceReady}
    <h3>Source Code</h3>
    <div id="editor"></div>
    <h3 style="margin-bottom: .25rem;">Actions</h3>
    <div class="button-list">
        <a href={bookmarklet.uri} on:click={() => {}}>Install (Drag me to bookmarks)</a>
        {#if bookmarklet?.devkit}
            <a href="https://www.taosdev.com/bookmarklet-devkit/#{bookmarklet.devkit}">Modify (Bookmarklet Devkit)</a>
        {/if}
    </div>
{/if}

<svelte:head>
    <title>Piny - Bookmarklets / {bookmarklet.name}</title>
    <meta name="description" content={bookmarklet.description}/>
    <link rel="preconnect" href="https://cdn.jsdelivr.net">
</svelte:head>

<style>
    #editor {
        height: 500px;
    }

    a {
        display: inline-block;
        padding: 0.5rem 1rem;
        background-color: #333;
        color: white;
        text-decoration: none;
        border-radius: 5px;
    }

    a:hover {
        background-color: #555;
    }

    .button-list {
        display: flex;
        flex-direction: column;
        gap: .75rem;
    }

    .button-list a {
        width: 100%;
    }

    #firefox-warning {
        display: block;
        margin-top: 0;
        margin-bottom: .25rem;
        padding: 1rem;
        background-color: darkred;
        color: white;
        border-radius: 5px;
    }
</style>