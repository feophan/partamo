<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import { Textarea } from "$lib/components/ui/textarea/index.js";
    import * as Tabs from "$lib/components/ui/tabs";

    import Icon from "svelte-radix/Gear.svelte";

    import { langs, tags } from '$lib/store-settings.js';
    
</script>

  <Dialog.Root>
    <Dialog.Trigger>
        <Button variant="ghost" size="icon" class="text-primary-foreground hover:text-secondary-foreground">
            <Icon class="w-4 h-4"/>
        </Button>
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
            </Tabs.List>
            <Tabs.Content value="languages">
                <Textarea id="languages" bind:value={$langs} class="h-32"/>
            </Tabs.Content>
            <Tabs.Content value="components">
                <Textarea id="components" bind:value={$tags} class="h-32"/>
            </Tabs.Content>
        </Tabs.Root>
    </div>
    </Dialog.Content>
  </Dialog.Root>