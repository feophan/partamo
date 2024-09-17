<script lang="ts">
    import XMLRender from './XMLRender.svelte';
    import { xml, chapter, lang } from '$lib/stores.js';
    
    // Props
    // export let render: Record<string, () => Promise<{ default: Render }>> = {};

    // Auto-subscribe to stores using the `$` prefix
    $: book = $xml;
	$: chap = $chapter;
    $: lg = $lang;

    // Reactive statement to update `root` whenever `book`, `chap`, or `lg` changes
    let root: Element[];

    $: root = parse(book, chap, lg);

    /**
     * Parses the XML document to find the relevant chapter and language.
     */
    function parse(book: Document | null, chap: string, lg: string[]): Element[] {
        if (!book || !chap || !lg || lg.length === 0) return [];
        if (book.querySelector('parsererror')) return [];

        // Create a CSS selector string for the languages
        const langSelector = lg.map(language => `div[lang="${language}"]`).join(', ');
        const bookLang = book.querySelectorAll(langSelector);

        // Arrays to store children of each language
        const childrenByLanguage: Element[][] = lg.map(() => []);

        // Collect children for each language
        for (let i = 0; i < bookLang.length; i++) {
            const element = bookLang[i];
            const languageIndex = lg.indexOf(element.getAttribute('lang') || '');
            if (languageIndex === -1) continue;

            const chapterElements = element.querySelectorAll(`div[n="${chap}"]`);
            Array.from(chapterElements).forEach(chapterElement => {
                Array.from(chapterElement.children).forEach(child => {
                    childrenByLanguage[languageIndex].push(child as Element);
                });
            });
        }

        // Interleave the children
        const interleavedChildren: Element[] = [];
        let maxLength = Math.max(...childrenByLanguage.map(arr => arr.length));
        
        for (let i = 0; i < maxLength; i++) {
            for (let j = 0; j < childrenByLanguage.length; j++) {
                if (i < childrenByLanguage[j].length) {
                    interleavedChildren.push(childrenByLanguage[j][i]);
                }
            }
        }

        return interleavedChildren;
    }

function updateNodeInXML() {
        // Update the $xml store with the modified document
        xml.set(book);
    }

</script>

{#if root}
    {#each root as par}
    <XMLRender node={par} on:updateNode={() => updateNodeInXML()} />
    {/each}
{:else}
    <span>Invalid XML</span>
{/if}
