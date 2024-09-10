<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import EditWord from '$lib/components/blocks/menuWord.svelte';
    import { tags } from '$lib/store-settings.js';
    export let node: Element;

    const dispatch = createEventDispatcher();

    type TagDefinition = {
        name: string;
        type?: string; // Optional type (e.g., 'main' or 'sub' for 'head')
        htmlTag: string;
        className: string;
        };

    $: tagDefinitions = JSON.parse($tags) as TagDefinition[];

    function getTagName(node: Element): string {
        const normalizedNodeName = node.nodeName;
        const type = node.getAttribute('type') || null;

        const tagDef = (type === null) ? tagDefinitions.find(def => def.name === normalizedNodeName) : tagDefinitions.find(def => def.name === normalizedNodeName && (def.type === type));

        return tagDef ? tagDef.htmlTag : 'span'; // Fallback to 'span' if tag not found
        }

    function getClass(node: Element): string {
        const normalizedNodeName = node.nodeName;
        const type = node.getAttribute('type') || null;

        const tagDef = (type === null) ? tagDefinitions.find(def => def.name === normalizedNodeName) : tagDefinitions.find(def => def.name === normalizedNodeName && (def.type === type));

        return tagDef ? tagDef.className : ''; // Fallback to empty string if no class found
        }

    function getDataAttributes(node: Element): Record<string, string> {
        const dataAttributes: Record<string, string> = {};

        for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i];
            if (attr.name == "id") {
                dataAttributes[attr.name] = attr.value;
            } else {
                dataAttributes['data-'.concat(attr.name)] = attr.value;
            }
        }

        return dataAttributes;
    }

    function handleMouseOver(event: MouseEvent | FocusEvent) {
        const target = event.target as HTMLElement;
        if (target && target.getAttribute('data-ref')) {
            let ref: Array<string> = JSON.parse(target.getAttribute('data-ref') as string);
            ref.forEach((e: string) => {
                const el = document.getElementById(e);
                if (el) {el.classList.add("bg-orange-500", "text-zinc-100", "rounded", "px-1")}
            });
        }
    }

    function handleMouseOut(event: MouseEvent | FocusEvent) {
        const target = event.target as HTMLElement;
        if (target && target.getAttribute('data-ref')) {
            let ref: Array<string> = JSON.parse(target.getAttribute('data-ref') as string);
            ref.forEach((e:string) => {
                const el = document.getElementById(e);
                if (el) {el.classList.remove("bg-orange-500", "text-zinc-100", "rounded", "px-1")}
            });
        }
    }
    
    function updateNodeContent(event: Event) {
        const target = event.target as HTMLElement;
        // Update the node with the new text content
        node.textContent = target.textContent;
        // Optionally dispatch an event or call a function to save changes to a backend
        dispatch('updateNode', node);
    }

    function isTextOnly(node: Element): boolean {
    // Check if all child nodes are text nodes, ignoring attributes
    return Array.from(node.childNodes).every(child => child.nodeType === Node.TEXT_NODE);
}

</script>

<!-- Render dynamic HTML elements -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<svelte:element
    this={getTagName(node)}
    class={getClass(node)}
    {...getDataAttributes(node)}
    contentEditable={!((node.nodeName === 'w') || !isTextOnly(node))}
    on:mouseover={handleMouseOver}
    on:focus={handleMouseOver}
    on:mouseleave={handleMouseOut}
    on:blur={handleMouseOut}
    on:input={updateNodeContent}>
    {#if node.nodeName.toLowerCase() === 'w'}
        <!-- Render the custom word component -->
        <EditWord attributes={getDataAttributes(node)} word={node.textContent} />
    {:else}
        {#each Array.from(node.childNodes) as child}
            {#if child.nodeType === 3}
                {child.textContent}
            {:else}
                <svelte:self node={child} />
            {/if}
        {/each}
    {/if}
</svelte:element>