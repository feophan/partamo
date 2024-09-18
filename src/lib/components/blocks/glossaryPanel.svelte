<script lang="ts">
    import { xml, lang } from '$lib/stores.js';
    import { langs } from '$lib/store-settings.js';
    import { onMount } from 'svelte';
    import { toast } from "svelte-sonner";

    import * as Table from "$lib/components/ui/table";

    // Define the language structure
    interface Language {
        value: string;
        label: string;
    }

    let glossary: { wordA: string, refs: string[] }[] = [];

    // Parse langs with the correct type
    const parsedLangs: Language[] = JSON.parse($langs);

    $: fromLang = parsedLangs.find((l: Language) => l.value === $lang[0]);
    $: toLang = parsedLangs.find((l: Language) => l.value === $lang[1]);

    // Function to generate glossary from the XML structure
    function generateGlossary() {
        if ($xml && $lang.length == 2) {
            glossary = [];
            const bookA = $xml.querySelector(`div[lang="${fromLang?.value}"]`);
            const bookB = $xml.querySelector(`div[lang="${toLang?.value}"]`);
            if (bookA && bookB) {
                const wordsA = bookA.querySelectorAll('w');

                wordsA.forEach((wordA: Element) => {
                    const refIds = wordA.getAttribute('ref');
                    if (refIds) {
                        const refs: string[] = JSON.parse(refIds);
                        const wordBTexts = refs.map(refId => {
                            const refWord = bookB.querySelector(`w[id="${refId}"]`);
                            return refWord?.textContent || '';
                        });
                        glossary.push({
                            wordA: wordA.textContent || '',
                            refs: wordBTexts
                        });
                    }
                });
            }
        } else {
            toast.error("Select 2 languages");
        }
    }

    // Generate glossary on component mount
    onMount(() => {
        generateGlossary();
    });
</script>

<!-- Table for displaying glossary -->
{#if $lang.length == 2}
<Table.Root class="mx-10 w-1/2">
    <Table.Caption>A glossary list.</Table.Caption>
    <Table.Header>
      <Table.Row>
        <Table.Head>{fromLang?.label}</Table.Head>
        <Table.Head>{toLang?.label}</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
        {#each glossary as { wordA, refs }}
        <Table.Row>
            <Table.Cell>{wordA}</Table.Cell>
            <Table.Cell>
                {#each refs as refWord, index}
                <span>{refWord}{index < refs.length - 1 ? ' ' : ''}</span>
                {/each}
            </Table.Cell>
          </Table.Row>
        {/each}
    </Table.Body>
  </Table.Root>
{:else}
<p>Select second language</p>
{/if}
