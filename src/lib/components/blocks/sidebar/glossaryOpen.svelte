<script lang="ts">
    import List from "svelte-radix/ListBullet.svelte";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Drawer from "$lib/components/ui/drawer";
    import Glossary from '../glossaryPanel.svelte';
    import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
    import * as Tooltip from "$lib/components/ui/tooltip";

    import { lang } from '$lib/stores.js';

    $: langNum = $lang.length;
    
    
</script>

<Drawer.Root>
    <Drawer.Trigger disabled={langNum !== 2}>
        <Tooltip.Root>
            <Tooltip.Trigger>
                <Button disabled={langNum !== 2} variant="ghost" size="icon" class="text-primary-foreground hover:text-secondary-foreground">
                    <List class="w-4 h-4"/>
                </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>
                <p>Open glossary</p>
            </Tooltip.Content>
      </Tooltip.Root>
    </Drawer.Trigger>
    <Drawer.Content>
        <ScrollArea class="h-[80vh] w-full rounded-md border">
            <Glossary />
        </ScrollArea>
    </Drawer.Content>
</Drawer.Root>