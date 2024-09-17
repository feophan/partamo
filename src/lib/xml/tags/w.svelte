<script lang="ts">
    export let attributes: Record<string, string>;
    export let tag: string;
    export let node: Element;

    let className;
    export { className as class };

    const handleRefHighlight = (event: MouseEvent | FocusEvent, action: 'add' | 'remove') => {
        const target = event.target as HTMLElement;
        const ref = target.getAttribute('data-ref');
        if (ref) {
            JSON.parse(ref).forEach((id: string) => {
                const el = document.getElementById(id);
                if (el) el.classList[action]("bg-orange-500", "text-zinc-100", "rounded", "px-1");
            });
        }
    };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events-->
<svelte:element
    this={tag}
    class={className}
    {...attributes}
    on:mouseover={e => handleRefHighlight(e, 'add')}
    on:mouseleave={e => handleRefHighlight(e, 'remove')}>
    <slot/>
</svelte:element>
