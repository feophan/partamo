<script lang="ts">
    import EditWord from '$lib/components/blocks/menuWord.svelte';
    export let node: Element;

    type TagMap = {
        head: Head;
        p: string;
        emph: string;
        w: string;
    }

    type Head = {
        main: string;
        sub:  string;
    }

    type HeadKey = keyof Head;

    const tagMap: TagMap = {
        head: {
            main: 'h1',
            sub: 'h2'
        },
        p: 'p',
        emph: 'span',
        w: 'span'
    };

    function normalizeNodeName(name: string): keyof TagMap | 'head' {
        return name.toLowerCase() as keyof TagMap | 'head';
    }

    function getTagName(node: Element): string {
        const normalizedNodeName = normalizeNodeName(node.nodeName);

        if (normalizedNodeName === 'head') {
            const attribute = node.attributes[0]?.value as HeadKey || 'main';
            return tagMap.head[attribute] || 'h1';
        } else {
            return tagMap[normalizedNodeName] || 'span';
        }
    }

    function getClass(node: Element): string {
        const normalizedNodeName = normalizeNodeName(node.nodeName);
        if (normalizedNodeName === 'head') {
            if (!(node.attributes[0]) || node.attributes[0].value === 'main') {
                return 'text-blue-500 font-bold';
            } else if (node.attributes[0]?.value === 'sub') {
                return 'text-sky-500 italic';
            }
        } else if (normalizedNodeName === 'emph') {
            return 'italic';
        } else if (normalizedNodeName === 'p') {
            return 'before:content-[attr(data-n)] -indent-4 before:pr-2 before:text-slate-300';
        } else if (normalizedNodeName === 'w') {
            return 'hover:bg-sky-500 hover:text-zinc-100 hover:rounded hover:px-1 inline-flex';
        }
        return '';
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
</script>

<!-- Render dynamic HTML elements -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<svelte:element
    this={getTagName(node)}
    class={getClass(node)}
    {...getDataAttributes(node)}
    on:mouseover={handleMouseOver}
    on:focus={handleMouseOver}
    on:mouseleave={handleMouseOut}
    on:blur={handleMouseOut}>
    {#if node.nodeName.toLowerCase() === 'w'}
        <!-- Render the custom paragraph component -->
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