<script lang="ts">
    import { xml, notePosition } from '$lib/stores.js';

    import { Button } from "$lib/components/ui/button/index.js";
    import Crump from "svelte-radix/CrumpledPaper.svelte";

    import { toast } from "svelte-sonner";

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
    };

    function removeNote() {
        if ($notePosition && book) { // Check if $contextPosition is not null
            const wordId = $notePosition[2].id; // Get the word ID
            $notePosition[2].classList.remove("underline", "decoration-indigo-500", "decoration-dotted");
            const word = book.querySelector(`#${wordId}`); // Find word in the XML document
            if (word && word.getAttribute('note') !== null) {
                word.removeAttribute('note');
                toast.success("Note removed.")
                xml.set(book);
            } else {toast.error('Note or word not found.')};
        }
    };
</script>

{#if $notePosition !== null && noteContent !== null}
<div id="note-popup" class="ease-in-out duration-150 fixed top-60 left-60 bg-popover text-popover-foreground z-50 w-72 rounded-md border p-4 shadow-md outline-none" style="top: {$notePosition[1]}px; left: {$notePosition[0]}px">
    <Button on:click={removeNote} variant="destructive" class="w-4 h-4 absolute top-0 right-0 m-2" size="icon"><Crump class="w-2 h-2"/></Button>
    <p contenteditable on:input={handleInput}>{noteContent}</p>
</div>
{/if}
