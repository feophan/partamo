<script lang="ts">
    import { xml } from '$lib/stores.js';

    import { Button } from "$lib/components/ui/button/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";

    import PlusCircled from "svelte-radix/PlusCircled.svelte";

    let chapterTitle = 'Chapter';
    let chapterSubTitle = '';
    let chapterNumber = '1';

    $: book = $xml;

  function addChapter() {
      if (book) {
          // Find the <version> element in the XML document
          const books = book.querySelectorAll("body > div");
          if (books) {
              books.forEach((e) => {
                const newChap = book.createElement("div");
                const newChapTitle = book.createElement("head");
                newChap.setAttribute("type","chapter");
                newChap.setAttribute("n",chapterNumber);
                newChapTitle.textContent = chapterTitle;
                if (chapterSubTitle) {
                    newChapTitle.setAttribute("type", "main");
                    newChap.appendChild(newChapTitle);
                    const newChapSubtitle = book.createElement("head");
                    newChapSubtitle.setAttribute("type", "sub");
                    newChapSubtitle.textContent = chapterSubTitle;
                    newChap.appendChild(newChapSubtitle);
                } else {
                    newChap.appendChild(newChapTitle);
                }
                e.appendChild(newChap);
            });
            xml.set(book);
            };
        }
  }

</script>
    
<Dialog.Root>
    <Dialog.Trigger class="w-full px-2 flex justify-center"><Button variant="ghost" size="icon">
        <PlusCircled class="w-4 h-4" />
    </Button></Dialog.Trigger>
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>Add chapter</Dialog.Title>
            <Dialog.Description>Define the information about your document subdivision here. Click save when you're done.</Dialog.Description>
        </Dialog.Header>
        <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
                <Label for="title" class="text-right">Title</Label>
                <Input id="title" bind:value={chapterTitle} class="col-span-3" autocomplete="off" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
                <Label for="subtitle" class="text-right">Subtitle</Label>
                <Input id="subtitle" bind:value={chapterSubTitle} class="col-span-3" autocomplete="off" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
                <Label for="number" class="text-right">Number</Label>
                <Input id="number" bind:value={chapterNumber} class="col-span-3" autocomplete="off" />
            </div>
        </div>
        <Dialog.Footer>
            <Button type="submit" on:click={addChapter}>Create chapter</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>