<script lang="ts">
    import { XML } from '$lib/index.js';
    import { lang, contextPosition, linkFlag } from '$lib/stores.js';
    import { tick } from 'svelte'; // Import tick to wait for DOM updates

    $: lg = $lang.length;

    $: newLang = '';

    import Context from '$lib/components/blocks/context/contextParagraph.svelte';
    import Create from './createLang.svelte';
    import { Input } from '$lib/components/ui/input/index.js';

    function onRightClick(e: MouseEvent) {
        e.stopPropagation();
        $contextPosition = [e.clientX, e.clientY, e.target as Element];
    }

    // Use reactivity for flag changes
    $: if ($linkFlag[0] === true) {
        // Use tick to wait for DOM updates before querying elements
        tick().then(() => {
            changeHoverColor('sky');
        });
    } else {
        tick().then(() => {
            changeHoverColor('emerald');
        });
    }

    // Function to switch hover colors dynamically
    function changeHoverColor(from: string) {
        const els = document.querySelectorAll(`.hover\\:bg-${from}-500`);
        const classes = ['hover:bg-sky-500', 'hover:bg-emerald-500', 'hover:outline-sky-500', 'hover:outline-emerald-500'];
        const indexClass = from === 'sky' ? 0 : 1;
        els.forEach(el => {
            el.classList.remove(classes[0 + indexClass]);
            el.classList.remove(classes[2 + indexClass]);
            el.classList.add(classes[1 - indexClass]);
            el.classList.add(classes[3 - indexClass]);
        });
    }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->

{#if lg > 0}
<Context />
<div on:contextmenu|preventDefault={onRightClick}
    class="grid {lg === 1 ? 'grid-cols-1' : 'grid-cols-2 gap-x-10'} col-span-6 gap-y-2 px-10">
    <XML />
</div>
{:else}
<div class="col-span-6 h-screen flex items-center justify-center">
    <div class="flex flex-col items-center justify-center gap-4">
        <p>Select a language</p>
        <p>or Add a new one</p>
        <div class="flex flex-row gap-2">
            <Input id="newLang" bind:value={newLang} class="w-12"/>
            <Create {newLang} />
        </div>
    </div>
</div>
{/if}
