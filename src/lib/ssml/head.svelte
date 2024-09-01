<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let ancestors: Element[];
	export let node: Node;

	const dispatch = createEventDispatcher<{ change: never }>();

	const tip = create_tip();

	function create_tip() {
		if (!(node instanceof Element)) {
			return '';
		}

		let tip = '';
		for (const attr of node.attributes) {
			tip += `${attr.name}="${attr.value}" `;
		}

		return tip.trim();
	}
</script>

<h1 class="text-xl bold pt-4 tooltip" data-tip={tip}>
	<slot />
</h1>