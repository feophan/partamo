<script lang="ts">
    import { xml, notePosition } from '$lib/stores.js';

    $: book = $xml;

    let wordId = ''; // Store the ID of the current paragraph
    let noteContent: string | null = null; // Holds the word note content for editing

    $: if ($notePosition && book) { // Check if $notePosition is not null
        wordId = $notePosition[2].id; // Get the paragraph ID
        const word = book.querySelector(`#${wordId}`); // Find word in the XML document
        noteContent = word ? word.getAttribute('note') : null; // Extract content to be edited
    }

    function handleInput(event: Event) {
        const target = event.target as HTMLElement; // Cast to HTMLElement
        const newNoteContent = target.textContent || '';
        const word = book!.querySelector(`#${wordId}`); // Find the word again
        if (word) {
            word.setAttribute('note', newNoteContent); // Update the note attribute
            xml.set(book); // Update the xml store
        }
    }
</script>

{#if $notePosition !== null && noteContent !== null}
<div id="note-popup" class="ease-in-out duration-150 fixed top-60 left-60 bg-popover text-popover-foreground z-50 w-72 rounded-md border p-4 shadow-md outline-none" style="top: {$notePosition[1]}px; left: {$notePosition[0]}px">
    <p contenteditable on:input={handleInput}>{noteContent}</p>
</div>
{/if}
