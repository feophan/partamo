<script lang="ts">
    import { xml, chapter } from '$lib/stores.js';
    import { Button } from "$lib/components/ui/button/index.js";
    import PlusCircled from "svelte-radix/PlusCircled.svelte";

    $: book = $xml;

    function addPar() {
      if (book) {
          // Find the <version> element in the XML document
          const chapters = book.querySelectorAll(`[type="chapter"][n="${$chapter}"]`);
          const chapLength = chapters[0].children.length;
          const lastPar = chapters[0].children.item(chapLength-1)?.getAttribute('n');
          chapters.forEach((e) => {
            const newPar = book.createElement("p");
            newPar.setAttribute("n",lastPar ? (parseInt(lastPar)+1).toString() : "1");
            newPar.id = e.id.concat(`-${newPar.getAttribute('n')}`);
            newPar.textContent = " ";
            e.appendChild(newPar);
          });
          xml.set(book);
        }
    }
</script>
    
<div class="col-start-3 col-end-5 flex justify-center mt-4">
    <Button variant="ghost" size="icon" on:click={addPar}>
        <PlusCircled class="w-4 h-4" />
    </Button>
</div>