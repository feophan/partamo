<script lang="ts">
    import { XML } from '$lib/index.js';
    import { lang } from '$lib/stores.js';

    $: lg = $lang.length;

</script>

{#if lg > 0}
<div class="grid {lg === 1 ? "grid-cols-1" : "grid-cols-2 gap-x-10"} col-span-6 gap-y-2 px-10">
    <XML />
</div>
{:else}
<div class="col-span-6 h-screen flex items-center justify-center">
    <p>Select a language</p>
</div>
{/if}
