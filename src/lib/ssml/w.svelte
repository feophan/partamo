<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let ancestors: Element[];
	export let node: Node;

	const dispatch = createEventDispatcher<{ change: never }>();

	// Type guard to check if node is an Element
	function isElement(node: Node): node is Element {
		return node.nodeType === Node.ELEMENT_NODE;
	}
</script>

<span class="hover:bg-sky-600 hover:text-zinc-100 hover:p-1 rounded-md">
	<slot />
</span>
