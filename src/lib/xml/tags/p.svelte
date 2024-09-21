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

    const handlePaste = (event: ClipboardEvent) => {
    event.preventDefault();

    const clipboardData = event.clipboardData;
    const pastedData = clipboardData?.getData('text/plain') || '';

    // Get the current text content in the editable area
    const target = event.target as HTMLElement;
    const currentContent = target.textContent || '';

    // Get the current selection (caret position) in the contenteditable area
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    if (range) {
        // Get the text before and after the caret (cursor position)
        const startText = currentContent.substring(0, range.startOffset);
        const endText = currentContent.substring(range.endOffset);

        // Combine the content before, pasted text, and the content after
        const newContent = startText + pastedData + endText;

        // Update the content without modifying the existing DOM directly
        target.textContent = newContent;

        // Move the caret to the end of the pasted content
        const newRange = document.createRange();
        const newSelection = window.getSelection();
        newRange.setStart(target.firstChild!, startText.length + pastedData.length);
        newRange.collapse(true);

        newSelection?.removeAllRanges();
        newSelection?.addRange(newRange);

        // Dispatch the event to update the node's content
        node.textContent = newContent;
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
    on:blur={updateNodeContent}
    on:paste={handlePaste}>
    <slot/>
</svelte:element>
{/key}
