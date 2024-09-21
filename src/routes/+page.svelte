<script lang="ts">
    import Sidebar from '$lib/components/blocks/sidebar/sidebar.svelte';
	import Panel from '$lib/components/blocks/textPanel.svelte';
	import Project from '$lib/components/blocks/sidebar/openProject.svelte';
	import Create from "$lib/components/blocks/createPar.svelte";
	import { contextPosition, notePosition, xml } from '$lib/stores.js';

	function onBodyClick(event: MouseEvent) {
		$contextPosition = null;

		const notePopup = document.getElementById('note-popup');
		if (notePopup && !notePopup.contains(event.target as Node)) {
			$notePosition = null;
		}
	}
</script>

<svelte:body on:click={onBodyClick} on:contextmenu={onBodyClick} />
<div class="hidden md:block overscroll-none h-screen">
	{#if $xml !== null}
	<Sidebar />
	<div class="grid grid-cols-6 py-4 ml-40">
		<Panel />
		<Create />
	</div>
	{:else}
		<div class="h-screen flex items-center justify-center">
			<Project />
		</div>
	{/if}
</div>