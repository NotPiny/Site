<script>
    import linkIcon from "$lib/images/link.svg";
    import githubIcon from "$lib/images/github.svg";

    let projects = [
        { 
            name: "DaalBot",
            category: "active",
            id: 1,
            description: "A Discord bot that I'm working on."
        },
        {
            name: "Project 2",
            category: "paused",
            id: 2,
            description: "A project that I'm working on."
        },
        { 
            name: "Project 3",
            category: "discontinued",
            id: 3,
            description: "e"
        },
    ];
</script>

<h1>Projects</h1>

<h2>Active</h2>
<hr/>
<div class="project-item-list">
    {#each projects.filter(project => project.category === "active") as project}
    <div class="project-item-box">
        <h3 id="project-item-name">{project.name}</h3>
        <p id="project-item-description">{project.description}</p>
        <a class="project-item-view bl" href="https://github.com/NotPiny/DaalBot">
            <img alt="View project source" src={githubIcon} style="width: 32px; height: 32px">
        </a>
        <a class="project-item-view br" href="/projects?project={project.id}">
            <img alt="View project details" src={linkIcon} style="width: 32px; height: 32px">
        </a>
    </div>
    {/each}
</div>
<hr/>

<h2>Paused</h2>
<ul>
    {#each projects.filter(project => project.category === "paused") as project}
    <li>{project.name}</li>
    {/each}
</ul>

<h2>Discontinued</h2>
<ul>
    {#each projects.filter(project => project.category === "discontinued") as project}
    <li>{project.name}</li>
    {/each}
</ul>

<style>
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

    .bl {
        bottom: 0;
        left: 0;
    }

    .br {
        bottom: 0;
        right: 0;
    }
</style>