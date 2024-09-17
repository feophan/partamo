<script lang="ts">
    export let attributes: Record<string, string>;
    export let node: Element;
    export let tag: string;

    $: editFlag = Array.from(node.childNodes).every(child => child.nodeType === 3);

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    
    const updateNodeContent = (event: Event) => {
        const target = event.target as HTMLElement;
        if (target.textContent !== node.textContent) {
            node.textContent = target.textContent;
            dispatch('updateNode', node);
        }
    };

    let className;
    export { className as class };
</script>

<!-- Use a key to force re-rendering -->
{#key node.id}
<svelte:element
    this={tag}
    class={className.concat(" [&[contenteditable]]:focus:border-none [&[contenteditable]]:focus:outline-none [&[contenteditable]]:active:border-none [&[contenteditable]]:active:outline-none")}
    {...attributes}
    contenteditable={editFlag}
    on:blur={updateNodeContent}>
    <slot/>
</svelte:element>
{/key}
