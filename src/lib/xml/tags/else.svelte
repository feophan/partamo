<script lang="ts">
    export let node: Element;
    export let attributes: Record<string, string>;
    export let tag: string;

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

<svelte:element
    this={tag}
    class={className.concat(" [&[contenteditable]]:focus:border-none [&[contenteditable]]:focus:outline-none [&[contenteditable]]:active:border-none [&[contenteditable]]:active:outline-none")}
    {...attributes}
    on:blur={updateNodeContent}
    contenteditable>
    <slot />
</svelte:element>