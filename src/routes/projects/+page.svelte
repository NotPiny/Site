<script>
    import ProjectCard from "./ProjectCard.svelte";

</script>
<main>
    <div class="content">
        <span class="header">
            <h1>Projects</h1>
        </span>
        <div class="projects-grid">
            <ProjectCard
                title="DaalBot"
                description="A Discord bot that provides various utilities and fun features for server members."
                image="https://media.piny.dev/DaalBotSquare.png"
                link="https://daalbot.xyz"
            />
            <ProjectCard
                title="Candy"
                description="A free and open source discord user app focused on utility"
                image="https://media.piny.dev/candy/pfp.png"
            />
            <ProjectCard
                title="XaeroShare"
                description="A minecraft mod that allows you to share Xaero's Minimap waypoints with specific players on the server."
                image="https://cdn.modrinth.com/data/tFFdBvRj/03e84bbffe60765719f7e132a6a105f5e37fe265_96.webp"
                link="https://modrinth.com/mod/xaeroshare"
            />
        </div>
    </div>
</main>

<style>
    .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        max-width: 650px;
        margin: 0 auto;
        gap: 20px;
    }
</style>