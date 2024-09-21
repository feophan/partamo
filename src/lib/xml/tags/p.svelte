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

    function handlePaste(event: ClipboardEvent) {
        event.preventDefault();
        
        // Get the clipboard data as plain text
        const clipboardText = event.clipboardData?.getData('text') || '';

        // Get the target of the paste event (the contenteditable element)
        const target = event.target as HTMLElement;

        // Clear the current content and insert the plain text
        if (target) {
            target.textContent = clipboardText; // Replace the entire content with the pasted text
        }
    }

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
    on:blur={updateNodeContent}
    on:paste={handlePaste}>
    <slot/>
</svelte:element>
{/key}
