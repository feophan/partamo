<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";
    export let dialogOpen = false;
</script>

<Dialog.Root bind:open={dialogOpen} onOpenChange={() => dialogOpen = !dialogOpen}>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>XML editor</Dialog.Title>
      </Dialog.Header>
      <slot />
    </Dialog.Content>
  </Dialog.Root>