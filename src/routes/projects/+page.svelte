<script>
    import linkIcon from "$lib/images/link.svg";
    import githubIcon from "$lib/images/github.svg";
    import { browser } from "$app/environment";

    let projects = [
        { 
            id: 1,
            name: "DaalBot",
            category: "active",
            description: "A Discord bot that I'm working on.",
            source: "https://github.com/NotPiny/DaalBot",
            href: "https://daalbot.xyz"
        },
        {
            id: 2,
            name: "piny.dev",
            category: "active",
            description: "This website your on right now.",
            source: "https://github.com/NotPiny/Site",
            href: "https://piny.dev"
        },
        {
            id: 3,
            name: "None",
            category: "paused",
            description: "There are no projects here.",
            source: "NSET"
        },
        {
            id: 4,
            name: "None",
            category: "discontinued",
            description: "There are no projects here.",
            source: "NSET"
        },
    ];

    if (browser) {
        const urlParams = new URLSearchParams(window.location.search);
        const project = urlParams.get("project");

        if (project) {
            alert(`This does nothing rn lol. Project: ${project}`)
            window.location.href = "/projects";
        }
    }
</script>

<svelte:head>
    <title>Piny - Projects</title>
    <meta name="description" content="A list of all my projects"/>
</svelte:head>

<h1>Projects</h1>

<h2>Active</h2>
<hr/>
<div class="project-item-list">
    {#each projects.filter(project => project.category === "active") as project}
    <div class="project-item-box">
        <h3 id="project-item-name">{project.name}</h3>
        <p id="project-item-description">{project.description}</p>
        {#if project.source !== "NSET"}
        <a class="project-item-view bl" href={project.source}>
            <img alt="View project source" src={githubIcon} style="width: 32px; height: 32px">
        </a>
        {/if}
        <a class="project-item-view br" href={project.href ? project.href : `/projects?project=${project.id}`}>
            <img alt="View project details" src={linkIcon} style="width: 32px; height: 32px">
        </a>
    </div>
    {/each}
</div>
<hr/>

<h2>Paused</h2>
<hr/>
<div class="project-item-list">
    {#each projects.filter(project => project.category === "paused") as project}
    <div class="project-item-box">
        <h3 id="project-item-name">{project.name}</h3>
        <p id="project-item-description">{project.description}</p>
        {#if project.source !== "NSET"}
        <a class="project-item-view bl" href={project.source}>
            <img alt="View project source" src={githubIcon} style="width: 32px; height: 32px">
        </a>
        {/if}
        <a class="project-item-view br" href="/projects?project={project.id}">
            <img alt="View project details" src={linkIcon} style="width: 32px; height: 32px">
        </a>
    </div>
    {/each}
</div>
<hr/>

<h2>Discontinued</h2>
<hr/>

<div class="project-item-list">
    {#each projects.filter(project => project.category === "discontinued") as project}
    <div class="project-item-box">
        <h3 id="project-item-name">{project.name}</h3>
        <p id="project-item-description">{project.description}</p>
        {#if project.source !== "NSET"}
        <a class="project-item-view bl" href={project.source}>
            <img alt="View project source" src={githubIcon} style="width: 32px; height: 32px">
        </a>
        {/if}
        <a class="project-item-view br" href="/projects?project={project.id}">
            <img alt="View project details" src={linkIcon} style="width: 32px; height: 32px">
        </a>
    </div>
    {/each}
</div>
<hr/>

<style>
    .project-item-list {
        display: grid;

        /* 5 Wide */
        grid-template-columns: repeat(3, 1fr);
    }

    .project-item-box {
        border: 5px solid rgb(25, 25, 25);
        background-color: rgb(32, 32, 32);
        border-radius: 5px;
        padding: 10px;
        margin: 10px;

        width: 250px;
        height: 300px;

        position: relative;
    }

    .project-item-view {
        color: rgb(255, 255, 255);

        position: absolute;

        margin: 10px;
    }

    h1 {
        font-weight: bolder;
    }

    h2 {
        font-weight: bold;
    }

    .bl {
        bottom: 0;
        left: 0;
    }

    .br {
        bottom: 0;
        right: 0;
    }
</style>