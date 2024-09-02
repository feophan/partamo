<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import Meta from "./metaInfo.svelte";
    import { toast } from "svelte-sonner";

    export let isOpenEdit: boolean;
    export let setIsOpen = () => {};

    export let word: string | null = '';
    export let attributes: Record<string, string>;

    import { xml } from '$lib/stores.js';
    
    // Auto-subscribe to stores using the `$` prefix
    $: book = $xml;

    // To hold the edited state
    let editedWord: string | null = word;
    let editedAttributes: Record<string, string> = { ...attributes };


    function updateMeta(key: string, value: string) {
        if (key === 'word') {
            editedWord = value;
        } else {
            editedAttributes = {
                ...editedAttributes,
                [key]: value
            };
        }
    }

    function submitMeta() {
        // Update the word element in the entire XML document
        const wordId = attributes.id; // Assuming id is in the attributes
        if (wordId && book) {
            // Find the <w> element by id in the entire XML document
            const wordElement = book.querySelector(`w[id="${wordId}"]`);
            if (wordElement) {
                wordElement.textContent = editedWord;

                // Update the xml store to reflect this change
                xml.set(book); // This updates the store with the modified document
                isOpenEdit = false;
                toast.success("Updated word", {
                    description: `${wordId}: ${editedWord}`
                });
            } else {
                toast.error(`No word found with id ${wordId}`);
            }
        } else {
            toast.error("Invalid word ID or XML document.");
        }
    }
</script>

<Dialog.Root open={isOpenEdit} onOpenChange={setIsOpen}>
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>Edit word</Dialog.Title>
            <Dialog.Description>Make changes to the word's metadata here. Click save when you're done.</Dialog.Description>
        </Dialog.Header>
        <div class="grid gap-4 py-4">
            <Meta key="word" val={editedWord} onInput={updateMeta} />
            {#each Object.entries(editedAttributes) as [key, val]}
                <Meta {key} {val} onInput={updateMeta} />
            {/each}
        </div>
        <Dialog.Footer>
            <Button type="submit" on:click={submitMeta}>Save changes</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
