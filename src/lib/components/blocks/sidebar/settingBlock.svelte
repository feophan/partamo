<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import * as Tabs from "$lib/components/ui/tabs";

    import { Input } from "$lib/components/ui/input/index.js";

    import * as Tooltip from "$lib/components/ui/tooltip";

    import Icon from "svelte-radix/Gear.svelte";
    import { langs, tags, tocLang } from '$lib/store-settings.js';

    function addLanguage() {
    // Create a new array to trigger reactivity
    langs.update((currentLangs) => {
        return [...currentLangs, { value: '', label: '' }];
    });
}

function removeLang(index: number) {
    // Create a new array to trigger reactivity
    langs.update((currentLangs) => {
        return currentLangs.filter((_, i) => i !== index);
    });
}


    function addTag() {
        $tags = [...$tags, { name: '', htmlTag: '', className: '' }];
    }

    function updateLang(index: number, field: 'value' | 'label', event: Event) {
        const input = event.target as HTMLInputElement; // Cast the target to HTMLInputElement
        const newValue = input?.value ?? ''; // Get the new value

        // Update the store using langs.update to ensure reactivity
        langs.update((currentLangs) => {
            const updatedLangs = [...currentLangs]; // Create a new array
            updatedLangs[index][field] = newValue; // Update the specific field
            return updatedLangs; // Return the new array
        });
}


    // Function to update a specific tag
    function updateTag(index: number, field: 'name' | 'htmlTag' | 'className', event: Event) {
        const input = event.target as HTMLInputElement; // Cast the target to HTMLInputElement
        const updatedTags = [...$tags];
        updatedTags[index][field] = input?.value ?? ''; // Optional chaining to avoid null errors
        $tags = updatedTags;
    }

    function removeTag(index: number) {
        $tags = $tags.filter((_, i) => i !== index);
    }
</script>

<Dialog.Root>
    <Dialog.Trigger>
        <Tooltip.Root>
            <Tooltip.Trigger><Button variant="ghost" size="icon" class="text-primary-foreground hover:text-secondary-foreground">
                <Icon class="w-4 h-4"/>
            </Button></Tooltip.Trigger>
            <Tooltip.Content>
              <p>Edit settings</p>
            </Tooltip.Content>
          </Tooltip.Root>
    </Dialog.Trigger>
    <Dialog.Content>   
        <div class="hidden space-y-6 p-10 pb-16 md:block">
            <div class="space-y-0.5">
                <h2 class="text-2xl font-bold tracking-tight">Settings</h2>
                <p class="text-muted-foreground">
                    Manage your app settings and display preferences.
                </p>
            </div>
            <Separator class="my-6" />
            <Tabs.Root value="languages">
                <Tabs.List>
                    <Tabs.Trigger value="languages">Languages</Tabs.Trigger>
                    <Tabs.Trigger value="components">Components</Tabs.Trigger>
                    <Tabs.Trigger value="toc">TOC</Tabs.Trigger>
                </Tabs.List>

                <!-- Language Tab -->
                <Tabs.Content value="languages">
                    <div class="space-y-4">
                        {#each $langs as lang, i}
                        <div class="flex items-center space-x-2">
                            <Input type="text" placeholder="Language Code" bind:value={lang.value} on:input={(e) => updateLang(i, 'value', e)} />
                            <Input type="text" placeholder="Language Name" bind:value={lang.label} on:input={(e) => updateLang(i, 'label', e)} />
                            <Button on:click={() => removeLang(i)} variant="destructive">Remove</Button>
                        </div>
                        {/each}
                        <Button on:click={addLanguage}>Add Language</Button>
                    </div>
                </Tabs.Content>

                <!-- Components (Tags) Tab -->
                <Tabs.Content value="components">
                    <div class="space-y-4">
                        {#each $tags as tag, i}
                        <div class="flex items-center space-x-2">
                            <Input type="text" placeholder="Tag Name" bind:value={tag.name} on:input={(e) => updateTag(i, 'name', e)} />
                            <Input type="text" placeholder="HTML Tag" bind:value={tag.htmlTag} on:input={(e) => updateTag(i, 'htmlTag', e)} />
                            <Input type="text" placeholder="Class Name" bind:value={tag.className} on:input={(e) => updateTag(i, 'className', e)} />
                            <Button on:click={() => removeTag(i)} variant="destructive">Remove</Button>
                        </div>
                        {/each}
                        <Button on:click={addTag}>Add Tag</Button>
                    </div>
                </Tabs.Content>

                <!-- Components (TOC) Tab -->
                <Tabs.Content value="toc">
                    <div class="space-y-4">
                        <div class="flex items-center space-x-2">
                            <Input type="text" placeholder="TOC language" bind:value={$tocLang} />
                        </div>
                    </div>
                </Tabs.Content>
            </Tabs.Root>
        </div>
    </Dialog.Content>
</Dialog.Root>
