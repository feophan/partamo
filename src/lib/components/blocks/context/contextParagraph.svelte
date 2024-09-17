<script lang="ts">
    import Item from "./contextItem.svelte";
    import { contextPosition, xml, linkFlag } from '$lib/stores.js';

    import Pencil from "svelte-radix/Pencil1.svelte";
    import Code from "svelte-radix/Code.svelte";
    import Link from "svelte-radix/Link2.svelte";
    import LinkBreak from "svelte-radix/LinkBreak2.svelte";

    $: book = $xml;

    let selectedWordId: string | null = null; // for linking

    function wrapParagraph() {
        if ($contextPosition !== null) {
            const paragraph = $contextPosition[2];
            if (book && paragraph.nodeName === "P") {
            const textContent = paragraph.textContent || "";

            // Use regex to match words with optional hyphens, punctuation, and spaces separately
            const words = textContent.match(/[\p{L}\p{M}'-]+|[\p{P}\p{S}]+|\s+/gu) || [];

            let wordIndex = 1; // To keep track of word indexes only

            const newPar = book.createElement("p");
            newPar.setAttribute('n', paragraph.getAttribute('data-n') || '');
            newPar.setAttribute('id', paragraph.getAttribute('id') || '');
            words.forEach((word) => {
                if (/[\w'-]+/.test(word)) {
                    // Create a <w> element for each word
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
        };
    };

    function linkWords() {
        if ($contextPosition !== null) {
            $linkFlag[0] = true;
            $linkFlag[1]= $contextPosition[2].id;
        }
    };

    function selectWord(e: Event) {
        const target = e.target as HTMLElement;
        const id = target.getAttribute('id');
        if (id) {
            selectedWordId = id;
            console.log("Selected word ID:", selectedWordId);
        }
    }

</script>

{#if $contextPosition !== null}
<div class="fixed z-10 top-32 left-32 bg-white rounded border border-gray-300" style="top: {$contextPosition[1]}px; left: {$contextPosition[0]}px">
    <Item disabled={true}><Pencil class="h-4 w-4"/>Edit</Item>
    <Item on:click={wrapParagraph} disabled={$contextPosition[2].nodeName !== 'P'}><Code class="h-4 w-4"/>Wrap</Item>
    <Item on:click={linkWords} disabled={$contextPosition[2].nodeName !== 'SPAN'}><Link class="h-4 w-4"/>Link</Item>
    <Item disabled={true}><LinkBreak class="h-4 w-4"/>Unlink</Item>
</div>
{/if}
