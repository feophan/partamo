<script lang="ts">
    import { xml, notePosition } from '$lib/stores.js';
    import { Button } from "$lib/components/ui/button/index.js";
    import Crump from "svelte-radix/CrumpledPaper.svelte";
    import { toast } from "svelte-sonner";

    $: book = $xml;

    let wordId = '';
    let noteContent: string | null = null;
    let adjustedLeft = 0;

    $: if ($notePosition && book) {
        wordId = $notePosition[2].id;
        const word = book.querySelector(`#${wordId}`);
        noteContent = word ? word.getAttribute('note') : null;

        // Adjust the left position if it overflows the window width
        const windowWidth = window.innerWidth;
        const popoverWidth = 288; // Set this to your popover's width in pixels (72 w-72 in Tailwind)
        adjustedLeft = $notePosition[0] + popoverWidth > windowWidth
            ? windowWidth - popoverWidth - 10 // 10px padding from the right edge
            : $notePosition[0];
    }

    function handleInput(event: Event) {
        const target = event.target as HTMLElement;
        const newNoteContent = target.textContent || '';
        const word = book!.querySelector(`#${wordId}`);
        if (word) {
            word.setAttribute('note', newNoteContent);
            xml.set(book);
        }
    };

    function removeNote() {
        if ($notePosition && book) {
            const wordId = $notePosition[2].id;
            $notePosition[2].classList.remove("underline", "decoration-indigo-500", "decoration-dotted");
            const word = book.querySelector(`#${wordId}`);
            if (word && word.getAttribute('note') !== null) {
                word.removeAttribute('note');
                toast.success("Note removed.");
                xml.set(book);
            } else { toast.error('Note or word not found.'); }
        }
    };
</script>

{#if $notePosition !== null && noteContent !== null}
<div id="note-popup" 
    class="ease-in-out duration-150 fixed top-60 left-60 bg-popover text-popover-foreground z-50 w-72 rounded-md border p-4 shadow-md outline-none" 
    style="top: {$notePosition[1]}px; left: {adjustedLeft}px">
    <Button on:click={removeNote} variant="destructive" class="w-4 h-4 absolute top-0 right-0 m-2" size="icon">
        <Crump class="w-2 h-2"/>
    </Button>
    <p contenteditable on:input={handleInput}>{noteContent}</p>
</div>
{/if}
