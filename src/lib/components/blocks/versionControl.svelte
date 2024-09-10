<script lang="ts">
    import { xml } from '$lib/stores.js';
    import { Badge } from "$lib/components/ui/badge";

    let book: Document | null;

    // Subscribe to xml stores
    $: xml.subscribe((value: Document | null) => {
        book = value;
        updateRoot();  // Ensure root is updated when book changes
    });

    let root: Element | null;

    // Parse the book to get the document version
    function parse(book: Document): Element | null {

        if (book == null || book.querySelector('parsererror')) {
            return null;
        }
        else {
            return book!.querySelector('version');
        }
    };

    // Update root whenever book changes
    function updateRoot() {
        if (book) {
            root = parse(book);
        } else {
            root = null;
        }
    }
    
</script>

{#if root}
<div class="px-6 mb-2">
    <Badge class="bg-primary-foreground/20">{root.getAttribute('major')}.{root.getAttribute('minor')}</Badge>
</div>
{/if}