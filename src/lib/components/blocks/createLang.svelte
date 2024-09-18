<script lang="ts">
    import { xml } from '$lib/stores.js';
    import { toast } from "svelte-sonner";
    import { Button } from "$lib/components/ui/button/index.js";
    import PlusCircled from "svelte-radix/PlusCircled.svelte";

    export let newLang;

    $: book = $xml;

    function addLanguage(newLang: string) {
        if (book) {
            // Find the first book to copy structure from
            const firstBook = book.querySelector('div[type="book"]');
            if (firstBook) {
                // Create new language book element
                const newBook = book.createElement("div");
                newBook.setAttribute("type", "book");
                newBook.setAttribute("lang", newLang);

                // Copy chapters and create corresponding empty paragraphs
                const chapters = firstBook.querySelectorAll('div[type="chapter"]');
                chapters.forEach((chapter) => {
                    const newChapter = book.createElement("div");

                    if (chapter.getAttribute("n") != null) {
                        newChapter.setAttribute("type", "chapter");
                        newChapter.setAttribute("n", chapter.getAttribute("n")!);
                        newChapter.setAttribute("id", `${newLang}-${chapter.getAttribute("n")}`);
                    } else {
                        toast.error('Your chapters are not numbered.')
                    }
                    
                    // Copy chapter headings
                    const headings = chapter.querySelectorAll("head");
                    headings.forEach((head) => {
                        const newHead = book.createElement("head");
                        newHead.setAttribute("type", head.getAttribute("type") || "main");
                        newHead.textContent = head.textContent;
                        newChapter.appendChild(newHead);
                    });

                    // Create empty paragraphs with the same structure
                    const paragraphs = chapter.querySelectorAll("p");
                    paragraphs.forEach((p) => {
                        const newParagraph = book.createElement("p");

                        if (p.getAttribute("n") != null) {
                            newParagraph.setAttribute("n", p.getAttribute("n")!);
                            newParagraph.setAttribute("id", `${newLang}-${chapter.getAttribute("n")}-${p.getAttribute("n")}`);
                            newParagraph.textContent = ""; // Empty content for the new language
                            newChapter.appendChild(newParagraph);
                        } else {toast.error("Your paragraphs are not numbered.")}
                    });

                    // Append new chapter to the new language book
                    newBook.appendChild(newChapter);
                });

                // Append new book to the XML document
                book.querySelector("body")?.appendChild(newBook);
                xml.set(book);
                toast.success("Language added");
            } else {
                console.error("No source book found to copy structure from.");
                toast.error("Language was not added: no source book found.");
            }
        }
    }
</script>

<Button variant="ghost" size="icon" on:click={() => addLanguage(newLang)}>
    <PlusCircled class="w-4 h-4" />
</Button>
