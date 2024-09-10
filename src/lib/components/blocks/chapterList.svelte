<script lang="ts">
    import { xml, chapter } from '$lib/stores.js';
    import { Button } from "$lib/components/ui/button";
    import Create from './createChapter.svelte';

    let book: Document | null;

    // Subscribe to xml and lang stores
    $: xml.subscribe((value: Document | null) => {
        book = value;
        updateRoot();  // Ensure root is updated when book changes
    });

    let root: NodeListOf<Element> | null;

    // Parse the book to get the chapters for the selected language
    function parse(book: Document): NodeListOf<Element> | null {

        if (book == null || book.querySelector('parsererror')) {
            return null;
        }
        else {
            let book_lg = book.querySelector(`[lang="en"]`);
            if (book_lg) {
                return book_lg.querySelectorAll('[type="chapter"]');
            } else {
                return null;
            }
        }
    };

    // Update root whenever book changes
    function updateRoot() {
        if (book) {
            root = parse(book);
        } else {
            root = null;
        }
    }

    // Update the selected chapter in the store
    function chapSelect(selectedChap: string) {
        chapter.set(selectedChap);
    }

    function getChapterNumber(chap: Element): string {
        const nAttr = chap.attributes.getNamedItem('n');
        return nAttr ? nAttr.value : '';
    }
</script>

<div class="py-2">
    <h2 class="mb-2 px-2 text-lg font-semibold tracking-tight">Content</h2>
    <div class="space-y-1">
        {#if root && root.length > 0}
            {#each [...root] as chap, i}
                <Button on:click={() => chapSelect(getChapterNumber(chap))} variant="ghost" class="w-full px-2 justify-start justify-items-start">
                    {@html chap.children[0] ? chap.children[0].innerHTML : `${i+1}`}
                </Button>
            {/each}
        {:else}
            <p class="w-full px-2 justify-start justify-items-start">No chapters available</p>
        {/if}
        <Create />
    </div>
</div>