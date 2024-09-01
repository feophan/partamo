<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let ancestors: Element[];
	export let node: Node;

	const dispatch = createEventDispatcher<{ change: never }>();
</script>

<p index={node.attributes[0].value} class="py-2 -indent-4 before:content-[attr(index)] before:pr-2 before:text-slate-400"><slot /></p>