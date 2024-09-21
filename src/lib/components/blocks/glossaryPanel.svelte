<script lang="ts">
    import { xml, lang } from '$lib/stores.js';
    import { langs } from '$lib/store-settings.js';
    import { onMount } from 'svelte';
    import { toast } from "svelte-sonner";

    import * as Table from "$lib/components/ui/table";

    import { Input } from "$lib/components/ui/input/index.js";

    import type { Lang } from '$lib/store-settings.js';

    let glossary: { wordA: string, refs: string[] }[] = [];
    let wordAFilter = ''; // Filter for wordA
    let refsFilter = ''; // Filter for refs

    // Parse langs with the correct type
    const parsedLangs = $langs;

    $: fromLang = parsedLangs.find((l: Lang) => l.value === $lang[0]);
    $: toLang = parsedLangs.find((l: Lang) => l.value === $lang[1]);

    function generateGlossary() {
    if ($xml && $lang.length === 2) {
        glossary = [];
        const bookA = $xml.querySelector(`div[lang="${fromLang?.value}"]`);
        const bookB = $xml.querySelector(`div[lang="${toLang?.value}"]`);
        if (bookA && bookB) {
            const wordsA = bookA.querySelectorAll('w');
            const wordMap: { [key: string]: { refs: Set<string>, instances: string[] } } = {};

            wordsA.forEach((wordA: Element) => {
                const refIds = wordA.getAttribute('ref');
                const wordAText = wordA.textContent || '';

                if (refIds) {
                    const refs: string[] = JSON.parse(refIds);
                    const refWords: Set<string> = new Set(); // Unique translations for this instance

                    refs.forEach(refId => {
                        const refWord = bookB.querySelector(`w[id="${refId}"]`);
                        const refWordText = refWord?.textContent || '';
                        if (refWordText) {
                            refWords.add(refWordText); // Collect unique translations for this instance
                        }
                    });

                    // Store translations for the current wordA
                    if (!wordMap[wordAText]) {
                        wordMap[wordAText] = { refs: new Set(), instances: [] };
                    }
                    
                    // Add unique translations of this instance
                    const instanceTranslation = Array.from(refWords).join(' ');
                    wordMap[wordAText].instances.push(instanceTranslation);
                    // Add instance translations to the overall refs set
                    refWords.forEach(ref => wordMap[wordAText].refs.add(ref));
                }
            });

            // Convert the map to the desired glossary format
            for (const [wordA, { refs, instances }] of Object.entries(wordMap)) {
                // Join unique instances with a space and different translations with a semicolon
                const uniqueInstances = Array.from(new Set(instances)); // Ensure instances are unique
                glossary.push({
                    wordA,
                    refs: uniqueInstances // Keep refs as an array
                });
            }
            // Sort the glossary by wordA alphabetically
            glossary.sort((a, b) => a.wordA.localeCompare(b.wordA));
        }
    } else {
        toast.error("Select 2 languages");
    }
}

    // Generate glossary on component mount
    onMount(() => {
        generateGlossary();
    });

    // Reactive filtered glossary
    $: filteredGlossary = glossary.filter(item => {
        const matchesWordA = item.wordA.toLowerCase().includes(wordAFilter.toLowerCase());
        const matchesRefs = item.refs.some(ref => ref.toLowerCase().includes(refsFilter.toLowerCase()));
        return matchesWordA && matchesRefs;
    });
</script>

<!-- Table for displaying glossary -->
{#if $lang.length === 2}
<Table.Root class="mx-10 w-1/2">
    <Table.Caption>A glossary list.</Table.Caption>
    <Table.Header>
        <Table.Row>
            <Table.Head>
                <div class="flex flex-row gap-2 items-baseline">
                    {fromLang?.label}
                    <Input type="text" bind:value={wordAFilter} placeholder="search" class="w-24"/>
                </div>
            </Table.Head>
            <Table.Head>
                <div class="flex flex-row gap-2 items-baseline">
                    {toLang?.label}
                    <Input type="text" bind:value={refsFilter} placeholder="search" class="w-24" />
                </div>
            </Table.Head>
        </Table.Row>
    </Table.Header>
    <Table.Body>
        {#each filteredGlossary as { wordA, refs }}
    <Table.Row>
        <Table.Cell>{wordA}</Table.Cell>
        <Table.Cell>
            <!-- Display each ref from the array -->
            {#each refs as refWord, index}
                <span>{refWord}{index < refs.length - 1 ? '; ' : ''}</span>
            {/each}
        </Table.Cell>
    </Table.Row>
{/each}

    </Table.Body>
</Table.Root>
{:else}
<p>Select second language</p>
{/if}