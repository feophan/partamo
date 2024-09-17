<script lang="ts">
    export let disabled;
</script>

<button on:click {disabled} class="hover:bg-gray-100 pl-2 pr-4 py-1 flex justify-start items-center gap-2 disabled:text-gray-400">
    <slot/>
</button>