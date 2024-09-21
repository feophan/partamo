<script lang="ts">
    import { xml, fileUploaded, fileName } from '$lib/stores.js';
    import { tocLang } from '$lib/store-settings.js';
    import { buttonVariants } from "$lib/components/ui/button";

    import { Button } from "$lib/components/ui/button/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";

    let fileNameInput = 'document';
    let divType = 'book';
    $: defLang = $tocLang;

    function createProject() {
        const xmlSkeleton = `
        <body>
            <version major="0" minor="1" />
            <div type="${divType}" lang="${defLang}">
            </div>
            <div type="${divType}" lang="qy">
            </div>
        </body>
        `
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlSkeleton, 'text/xml');
        xml.set(doc);
        fileUploaded.set(true);
        fileName.set(fileNameInput);
    };

    
</script>
    
<Dialog.Root>
    <Dialog.Trigger class={buttonVariants({ variant: "outline" })}>Create Project</Dialog.Trigger>
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>Create Project</Dialog.Title>
            <Dialog.Description>Define the basic information about your document here. Click save when you're done.</Dialog.Description>
        </Dialog.Header>
        <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
                <Label for="name" class="text-right">File name</Label>
                <Input id="name" bind:value={fileNameInput} class="col-span-3" autocomplete="off" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
                <Label for="lang" class="text-right">Default language</Label>
                <Input id="lang" bind:value={defLang} class="col-span-3" autocomplete="off" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
                <Label for="div" class="text-right">Division type</Label>
                <Input id="div" bind:value={divType} class="col-span-3" autocomplete="off" />
            </div>
        </div>
        <Dialog.Footer>
            <Button type="submit" on:click={createProject}>Create project</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>