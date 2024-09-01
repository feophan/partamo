<script lang="ts">
    import Sidebar from '$lib/components/blocks/sidebar.svelte';
	import Panel from '$lib/components/blocks/textPanel.svelte';
	import Project from '$lib/components/blocks/openProject.svelte';
	import { xml } from '$lib/stores.js';
</script>

<div class="hidden md:block overscroll-none">
	{#if $xml !== null}
	<Sidebar />
	<div class="grid grid-cols-6 py-4 ml-40">
		<Panel />
	</div>
	{:else}
		<div class="h-screen flex items-center justify-center">
			<Project />
		</div>
	{/if}
</div>