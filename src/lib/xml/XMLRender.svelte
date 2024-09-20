<script lang="ts">
    import WordComponent from './tags/w.svelte';
    import ParagraphComponent from './tags/p.svelte';
    import ElseComponent from './tags/else.svelte';

    import { tags } from '$lib/store-settings.js';

    export let node: Element;

    $: tagDefinitions = $tags;

    const findTagDefinition = (nodeName: string, type: string | null) =>
            type === null
            ? tagDefinitions.find(def => def.name === nodeName)
            : tagDefinitions.find(def => def.name === nodeName && def.type === type);

    const getTagName = (node: Element) =>
    findTagDefinition(node.nodeName, node.getAttribute('type'))?.htmlTag || 'span';

    const getClass = (node: Element) =>
    findTagDefinition(node.nodeName, node.getAttribute('type'))?.className || '';

    const tagComponents = {
        'w': WordComponent,
        'p': ParagraphComponent
    };

    const getComponentForTag = (nodeName: string) => {
        return tagComponents[nodeName as keyof typeof tagComponents] || ElseComponent;
    };

    const getDataAttributes = (node: Element) =>
        Array.from(node.attributes).reduce((attrs, attr) => {
            attrs[attr.name === "id" ? attr.name : `data-${attr.name}`] = attr.value;
            return attrs;
        }, {} as Record<string, string>);

    const nodeName = getComponentForTag(node.nodeName.toLowerCase());

</script>

<!-- Render dynamic HTML elements -->

<svelte:component
    this={nodeName}
    tag={getTagName(node)}
    class={getClass(node)}
    {node}
    attributes={getDataAttributes(node)}
    on:updateNode>
        {#each Array.from(node.childNodes) as child}
            {#if child.nodeType === 3}
                {child.textContent}
            {:else}
                <svelte:self node={child} />
            {/if}
        {/each}
</svelte:component>

