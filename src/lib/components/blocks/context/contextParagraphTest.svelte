<script lang="ts">
    import Item from "./contextItem.svelte";
    import { contextPosition, xml } from '$lib/stores.js';
    import Pencil from "svelte-radix/Pencil1.svelte";
    import Code from "svelte-radix/Code.svelte";
    import Link from "svelte-radix/Link2.svelte";
    import LinkBreak from "svelte-radix/LinkBreak2.svelte";
    import Dialog from '../editorPanel.svelte'; // Import the dialog component
    import XMLEditor from '$lib/xml/XMLEditor.svelte'; // Import your XMLEditor component

    $: book = $xml; // Reactive assignment of the XML document

    let dialogOpen = false;
    let paragraphContent = ''; // Holds the paragraph content for editing
    let paragraphId = ''; // Store the ID of the current paragraph

    function openEditor() {
        paragraphId = $contextPosition[2].id; // Get the paragraph ID
        const paragraph = book.querySelector(`#${paragraphId}`); // Find paragraph in the XML document
        paragraphContent = paragraph ? paragraph.innerHTML : ''; // Extract content to be edited

        dialogOpen = true; // Open the dialog
    }

    function handleInput(event) {
        paragraphContent = event.detail; // Update paragraphContent with the latest value from the editor
        console.log(paragraphContent);
        const paragraph = book.querySelector(`#${paragraphId}`);
        if (paragraph) {
            paragraph.innerHTML = paragraphContent; // Update the XML content with new paragraph content
            xml.set(book);
        }
    }
</script>

<!-- Context menu -->
{#if $contextPosition !== null}
<div class="fixed z-10 top-32 left-32 bg-white rounded border border-gray-300" style="top: {$contextPosition[1]}px; left: {$contextPosition[0]}px">
    <Item on:click={openEditor} disabled={$contextPosition[2].nodeName !== 'P'}><Pencil class="h-4 w-4"/>Edit</Item>
    <Item disabled={true}><Code class="h-4 w-4"/>Wrap</Item>
    <Item disabled={true}><Link class="h-4 w-4"/>Link</Item>
    <Item disabled={true}><LinkBreak class="h-4 w-4"/>Unlink</Item>
</div>
{/if}

<!-- Dialog for editing -->
<Dialog bind:dialogOpen={dialogOpen}>
    <XMLEditor bind:content={paragraphContent} on:input={handleInput} />
</Dialog>
