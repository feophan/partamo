<script lang="ts">
    import { XML } from '$lib/index.js';
    import { lang, contextPosition } from '$lib/stores.js';

    $: lg = $lang.length;

    import Context from '$lib/components/blocks/context/contextParagraph.svelte';

    function onRightClick(e: MouseEvent) {
        console.log(e);
        e.stopPropagation();
        $contextPosition = [e.clientX, e.clientY, e.target as Element];
    }

</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->

{#if lg > 0}
<Context />
<div on:contextmenu|preventDefault={onRightClick}
    class="grid {lg === 1 ? "grid-cols-1" : "grid-cols-2 gap-x-10"} col-span-6 gap-y-2 px-10">
    <XML />
</div>
{:else}
<div class="col-span-6 h-screen flex items-center justify-center">
    <p>Select a language</p>
</div>
{/if}
