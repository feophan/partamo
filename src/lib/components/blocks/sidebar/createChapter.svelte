<script lang="ts">
    import { xml } from '$lib/stores.js';
    import { Button } from "$lib/components/ui/button/index.js";
    import PlusCircled from "svelte-radix/PlusCircled.svelte";

    import * as Tooltip from "$lib/components/ui/tooltip";

    const chapSub = true;

    $: book = $xml;

  function addChapter() {
      if (book) {
          // Find the <version> element in the XML document
          const books = book.querySelectorAll("body > div");
          const lastChap: string | null = books[0].lastElementChild ? books[0].lastElementChild.getAttribute('n') : "0"; // add error processing if no book is present
          if (books) {
              books.forEach((e) => {
                const newChap = book.createElement("div");
                const newChapTitle = book.createElement("head");
                newChap.setAttribute("type","chapter");
                newChap.setAttribute("n", lastChap ? (parseInt(lastChap)+1).toString() : "1");
                newChap.id = e.getAttribute('lang')!.concat(`-${newChap.getAttribute('n')}`); // add error processing if lang is not present
                newChapTitle.textContent = `Chapter ${newChap.getAttribute('n')} title`;
                if (chapSub) {
                    newChapTitle.setAttribute("type", "main");
                    newChap.appendChild(newChapTitle);
                    const newChapSubtitle = book.createElement("head");
                    newChapSubtitle.setAttribute("type", "sub");
                    newChapSubtitle.textContent = 'Subtitle';
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

<Tooltip.Root>
    <Tooltip.Trigger><Button variant="ghost" size="icon" on:click={addChapter}>
        <PlusCircled class="w-4 h-4" />
    </Button></Tooltip.Trigger>
    <Tooltip.Content>
      <p>Add chapter</p>
    </Tooltip.Content>
  </Tooltip.Root>
    
