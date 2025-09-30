<script lang="ts">
    export let title: string;
    export let description: string;
    export let image: string | null = null;
    export let link: string | null = null;
</script>

<a href={link ?? "#"} style="text-decoration: none;" class="card" target={link ? "_blank" : "_self"} rel="noopener noreferrer">
    <article class="project-card">
        <div class="project-header">
            {#if image}
                <img src={image} alt={title} class="project-image" />
            {/if}
            <h2 class="project-title">{title}</h2>
        </div>
        <div class="project-details">
            <p class="project-description">{description}</p>
        </div>
    </article>
</a>

<style lang="scss">
    article {
        border-radius: 20px;
        transition: box-shadow 0.3s;

        &:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .project-header {
            display: flex;
            align-items: center;

            border-radius: 20px 20px 0 0;

            background-color: #2c2c2c;

            .project-image {
                width: 50px;
                height: 50px;
                border-radius: 4px;
                margin-right: 12px;
                object-fit: cover;
            }

            .project-title {
                font-size: 1.5em;
                margin: 0;
                color: #d6d0d0;
            }
        }

        .project-details {
            background-color: #1e1e1e;
            padding: 16px;
            border-radius: 0 0 20px 20px;

            .project-description {
                font-size: 1em;
                color: #d1cdcd;
                margin: 0;
            }
        }
    }
</style>