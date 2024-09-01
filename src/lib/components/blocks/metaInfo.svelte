<script lang="ts">
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";

    export let key: string;
    export let val: string | null;

    export let onInput: (key: string, value: string) => void;

    function handleInput(event: Event) {
        const input = event.target as HTMLInputElement;
        onInput(key, input.value);
    }

    const disabled = (key == 'id') ? true : false;

    const keyDict: Record<string, string> = {
        "word": "Word",
        "id": "ID",
        "data-ref": "Link"
    };

</script>

<div class="grid grid-cols-4 items-center gap-4">
    <Label for={`key-${key}`} class="text-right">{keyDict[key]}</Label>
    <Input id={`key-${key}`} bind:value={val} class="col-span-3" {disabled} on:input={handleInput} type="text"/>
</div>