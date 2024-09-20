<script lang="ts">
    import { xml, lang } from '$lib/stores.js';
    import { langs } from '$lib/store-settings.js';
    import { onMount } from 'svelte';
    import Letter from "svelte-radix/LetterCaseCapitalize.svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Tooltip from "$lib/components/ui/tooltip";

    interface Selection {
        value: string;
        label: string;
    }

    let lang_list: Selection[] = []; // Available languages based on the document
    let selectedLangs: Selection[] = []; // Array of selected languages
    let checkedState: { [key: string]: boolean } = {}; // Object to track the checked state of each language
    let book: Document | null = null;

    // Function to parse the book and extract available languages
    const parse = (book: Document): string[] =>
        Array.from(book.querySelectorAll('div[lang]'))
            .map(e => e.getAttribute('lang')!)
            .filter(Boolean);

    // Function to update the language list and selected languages
    const updateLangList = () => {
        if (!book) return;
        const availableLangs = parse(book);
        
        // Get the current languages from the store
        const parsedLangs: Selection[] = $langs; 
        lang_list = parsedLangs.filter(lang => availableLangs.includes(lang.value));

        // Keep only valid selected languages
        selectedLangs = selectedLangs.filter(selectedLang => availableLangs.includes(selectedLang.value));

        // Update the checked state for each language
        checkedState = lang_list.reduce((acc, lang) => {
            acc[lang.value] = selectedLangs.some(selectedLang => selectedLang.value === lang.value);
            return acc;
        }, {} as { [key: string]: boolean });
    };

    // Subscribe to xml store and initialize lang_list on mount
    onMount(() => {
        const unsubscribeXml = xml.subscribe(value => {
            book = value;
            updateLangList();
        });

        const unsubscribeLangs = langs.subscribe(() => {
            updateLangList(); // Update the list whenever langs changes
        });

        return () => {
            unsubscribeXml();
            unsubscribeLangs(); // Clean up subscriptions
        };
    });

    // Handle selection change
    const handleSelectionChange = (lan: Selection) => {
        const isChecked = !checkedState[lan.value];

        if (isChecked) {
            if (selectedLangs.length < 2) {
                selectedLangs.push(lan); // Add language if less than 2 are selected
                checkedState[lan.value] = true;
            }
        } else {
            selectedLangs = selectedLangs.filter(l => l.value !== lan.value); // Remove language
            checkedState[lan.value] = false;
        }

        // Update the store
        lang.set(selectedLangs.map(s => s.value));
    };

    // Determine the items to show in the dropdown
    $: items = selectedLangs.length >= 2 ? selectedLangs : lang_list;
</script>

<DropdownMenu.Root closeOnItemClick={false}>
    <DropdownMenu.Trigger asChild let:builder>
        <Tooltip.Root>
            <Tooltip.Trigger><Button variant="ghost" size="icon" builders={[builder]} class="text-primary-foreground hover:text-secondary-foreground"><Letter class="w-4 h-4"/></Button></Tooltip.Trigger>
            <Tooltip.Content>
              <p>Select languages</p>
            </Tooltip.Content>
          </Tooltip.Root>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="w-56">
        {#each items as lang}
            <DropdownMenu.CheckboxItem
                checked={checkedState[lang.value]}
                on:click={() => handleSelectionChange(lang)}
                disabled={!checkedState[lang.value] && selectedLangs.length >= 2}
            >
                {lang.label}
            </DropdownMenu.CheckboxItem>
        {/each}
    </DropdownMenu.Content>
</DropdownMenu.Root>
