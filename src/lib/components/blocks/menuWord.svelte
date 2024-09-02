<script lang="ts">
  import * as ContextMenu from "$lib/components/ui/context-menu";
  import Pencil from "svelte-radix/Pencil1.svelte";
  import Plus from "svelte-radix/PlusCircled.svelte";
  import Link from "svelte-radix/Link2.svelte";
  import Code from "svelte-radix/Code.svelte";
  import Trash from "svelte-radix/Trash.svelte";
  import { onMount, onDestroy } from "svelte";
  import { activeContextMenu } from '$lib/stores.js';

  import EditWord from "./editWord.svelte";
  import ContextMenuSeparator from "$lib/components/ui/context-menu/context-menu-separator.svelte";

  export let word: string | null = '';
  export let attributes: Record<string, string>;
  let isOpenEdit: boolean;

  $: active = $activeContextMenu;

  let id = word || '';  // Unique ID for each word

  function setIsOpen() {
    isOpenEdit = !isOpenEdit;
  }

  function handleContextMenuOpen() {
    // Set the current context menu as active
    activeContextMenu.set(id);
  }

  function handleContextMenuClose() {
    // Clear the active context menu if it was this one
    if (active === id) {
      activeContextMenu.set(null);
    }
  }

  // Subscribe to the active context menu store
  $: isActive = $activeContextMenu === id;

  onMount(() => {
    if (isActive) handleContextMenuOpen();
  });

  onDestroy(() => {
    handleContextMenuClose();
  });
</script>

<ContextMenu.Root disableFocusFirstItem={true}>
  <ContextMenu.Trigger asChild let:builder>
    <button use:builder.action {...builder} {...attributes} on:contextmenu={handleContextMenuOpen}>
      {word}
    </button>
  </ContextMenu.Trigger>
  {#if isActive}
    <ContextMenu.Content>
      <ContextMenu.Item>
        <button class="flex items-center gap-2" on:click={setIsOpen}>
          <Pencil class="h-4 w-4" /><span>Edit</span>
        </button>
      </ContextMenu.Item>
      <ContextMenu.Item>
        <div class="flex items-center gap-2"><Plus class="h-4 w-4" /><span>Add</span></div>
      </ContextMenu.Item>
      <ContextMenu.Item>
        <div class="flex items-center gap-2"><Link class="h-4 w-4" /><span>Link</span></div>
      </ContextMenu.Item>
      <ContextMenu.Item>
        <div class="flex items-center gap-2"><Code class="h-4 w-4" /><span>Wrap</span></div>
      </ContextMenu.Item>
      <ContextMenuSeparator />
      <ContextMenu.Item>
        <div class="flex items-center gap-2"><Trash class="h-4 w-4" /><span>Delete</span></div>
      </ContextMenu.Item>
    </ContextMenu.Content>
  {/if}
</ContextMenu.Root>

<EditWord {isOpenEdit} {setIsOpen} {word} {attributes} />