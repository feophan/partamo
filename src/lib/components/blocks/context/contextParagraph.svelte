<script lang="ts">
    import Item from "./contextItem.svelte";
    import { contextPosition, xml, linkFlag } from '$lib/stores.js';

    import { onMount, onDestroy } from "svelte";

    import { toast } from "svelte-sonner";

    import Pencil from "svelte-radix/Pencil1.svelte";
    import Code from "svelte-radix/Code.svelte";
    import Link from "svelte-radix/Link2.svelte";
    import LinkBreak from "svelte-radix/LinkBreak2.svelte";
    import File from "svelte-radix/File.svelte";

    import Dialog from '../editorPanel.svelte'; // Import the dialog component
    import XMLEditor from '$lib/xml/XMLEditor.svelte'; // Import your XMLEditor component

    $: book = $xml;

    const elTest = ['P', 'SPAN'];

    // Wrapping

    function wrapParagraph() {
        if ($contextPosition !== null) {
            const paragraph = $contextPosition[2];
            if (book && paragraph.nodeName === "P") {
                const textContent = paragraph.textContent || "";

                // Use regex to match words, including single-letter accented characters and numbers
                const words = textContent.match(/[\p{L}\p{M}'\d-]+|[\p{P}\p{S}]+|\s+/gu) || [];

                let wordIndex = 1; // To keep track of word indexes

                const newPar = book.createElement("p");
                newPar.setAttribute('n', paragraph.getAttribute('data-n') || '');
                newPar.setAttribute('id', paragraph.getAttribute('id') || '');

                words.forEach((word) => {
                    if (/[\p{L}\p{M}\d'-]+/u.test(word)) {
                        // Create a <w> element for each word or number
                        const wElement = book.createElement("w");
                        wElement.setAttribute("id", `${paragraph.id}-${wordIndex}`);
                        wElement.textContent = word;
                        newPar.appendChild(wElement);
                        wordIndex++;
                    } else {
                        // Append punctuation and spaces directly as text nodes
                        const textNode = book.createTextNode(word);
                        newPar.appendChild(textNode);
                    }
                });

                const wrappedParagraph = book!.getElementById(paragraph.id);
                if (wrappedParagraph) {
                    wrappedParagraph.replaceWith(newPar);
                    xml.set(book); // Only update if book and paragraph are valid
                } else {
                    console.error(`Paragraph with id ${paragraph.id} not found in the document.`);
                }
            } else {
                console.error('Book is null or paragraph node is not a P element.');
            }
        }
    }


    // Linking

    function linkWords() {
        if ($contextPosition !== null) {
            $linkFlag[0] = true;
            $linkFlag[1]= $contextPosition[2].id;
        }
    };

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            $linkFlag[0] = false; // Reset the link flag
        }
    }

    onMount(() => {
        window.addEventListener('keydown', handleKeyDown);
    });

    onDestroy(() => {
        window.removeEventListener('keydown', handleKeyDown);
    });

    // Editor

    let dialogOpen = false;
    let paragraphContent = ''; // Holds the paragraph content for editing
    let paragraphId = ''; // Store the ID of the current paragraph

    function openEditor() {
    if ($contextPosition && book) { // Check if $contextPosition is not null
        paragraphId = $contextPosition[2].id; // Get the paragraph ID
        const paragraph = book.querySelector(`#${paragraphId}`); // Find paragraph in the XML document
        paragraphContent = paragraph ? paragraph.outerHTML : ''; // Extract content to be edited

        dialogOpen = true; // Open the dialog
    }
}

    function handleInput(event: CustomEvent<string>) {
        paragraphContent = event.detail; // Update paragraphContent with the latest value from the editor
        const paragraph = book!.querySelector(`#${paragraphId}`);
        if (paragraph) {
            paragraph.outerHTML = paragraphContent; // Update the XML content with new paragraph content
            xml.set(book);
        }
    }

    // Unlinking

    function unlinkWord() {
        if ($contextPosition && book) {
            const wordId = $contextPosition[2].id; // Get the ID of the clicked word
            const wordElement = book.getElementById(wordId);
            if (wordElement) {
            // Clear the ref attribute of the clicked word
            wordElement.setAttribute('ref', '[]');

            // Remove this word ID from all other words' ref attributes
            const allWords = book.querySelectorAll('[ref]');
            allWords.forEach((el) => {
                const ref = el.getAttribute('ref');
                if (ref) {
                    const refs = JSON.parse(ref);
                    const updatedRefs = refs.filter((id: string) => id !== wordId);
                    el.setAttribute('ref', JSON.stringify(updatedRefs));
                }
            });

            // Update the store to trigger reactivity
            xml.set(book);
            }
        }
    }

    // Add note

    function addNote() {
        if ($contextPosition && book) { // Check if $contextPosition is not null
            const wordId = $contextPosition[2].id; // Get the word ID
            const word = book.querySelector(`#${wordId}`); // Find word in the XML document
            if (word && word.getAttribute('note') === null) {
                word.setAttribute('note', '');
                $contextPosition[2].classList.add("underline", "decoration-indigo-500", "decoration-dotted");
                toast.success('Empty note added.');
                xml.set(book);
            } else if (word && word.getAttribute('note') !== null) {
                toast.error('A note already exists.');
            } else {toast.error('Word not found.')};
        }
    }

</script>

{#if $contextPosition !== null}
<div class="fixed z-10 top-32 left-32 bg-white rounded border border-gray-300" style="top: {$contextPosition[1]}px; left: {$contextPosition[0]}px">
    <Item on:click={openEditor} disabled={!elTest.includes($contextPosition[2].nodeName)}><Pencil class="h-4 w-4"/>Edit</Item>
    <Item on:click={wrapParagraph} disabled={$contextPosition[2].nodeName !== elTest[0]}><Code class="h-4 w-4"/>Wrap</Item>
    <Item on:click={linkWords} disabled={$contextPosition[2].nodeName !== elTest[1]}><Link class="h-4 w-4"/>Link</Item>
    <Item on:click={unlinkWord} disabled={$contextPosition[2].nodeName !== elTest[1]}><LinkBreak class="h-4 w-4"/>Unlink</Item>
    <Item on:click={addNote} disabled={$contextPosition[2].nodeName !== elTest[1]}><File class="h-4 w-4"/>Add note</Item>
</div>
{/if}

<!-- Dialog for editing -->
<Dialog bind:dialogOpen={dialogOpen}>
    <XMLEditor bind:content={paragraphContent} on:input={handleInput} />
</Dialog>