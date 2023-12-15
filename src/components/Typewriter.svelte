<script>
    import { onMount } from 'svelte';

    /**
     * @type {string[]}
    */
    export let texts = [];

    /**
     * @type {number}
    */
    export let externalDelay = 100;
    let currentText = '';
    let currentIndex = 0;
    let isReversed = false;

    const typeWriter = () => {
        const text = texts[currentIndex];
        const delay = isReversed ? externalDelay / 2 : externalDelay;

        if (!isReversed) {
            currentText = text.slice(0, currentText.length + 1);
        } else {
            currentText = text.slice(0, currentText.length - 1);
        }

        if (currentText === text) {
            isReversed = true;
            setTimeout(typeWriter, 1000);
        } else if (currentText === '') {
            isReversed = false;
            currentIndex = (currentIndex + 1) % texts.length;
            setTimeout(typeWriter, 1000);
        } else {
            setTimeout(typeWriter, delay);
        }
    };

    onMount(() => {
        typeWriter();
    });
</script>

<p>{@html currentText}</p>

<style>
    p {
        margin: 0;
    }
</style>