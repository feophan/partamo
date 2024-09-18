<script lang="ts">
    import List from "svelte-radix/ListBullet.svelte";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Drawer from "$lib/components/ui/drawer";
    import Glossary from '../glossaryPanel.svelte';
    import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
</script>

<Drawer.Root>
    <Drawer.Trigger><Button variant="ghost" size="icon" class="text-primary-foreground hover:text-secondary-foreground"><List class="w-4 h-4"/></Button></Drawer.Trigger>
    <Drawer.Content>
        <ScrollArea class="h-96 w-full rounded-md border">
            <Glossary />
        </ScrollArea>
    </Drawer.Content>
</Drawer.Root>