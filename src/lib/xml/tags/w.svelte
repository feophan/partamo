<script lang="ts">
    import { linkFlag, xml } from '$lib/stores.js';

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
                if (el) el.classList[action]("bg-orange-500", "text-zinc-100", "rounded", "outline", "outline-2", "outline-orange-500");
            });
        }
    };

    function linkWord(e: MouseEvent) {
        const target = e.target as HTMLElement;

        if ($linkFlag[0] && $linkFlag[1]) {

            const refWordId = target.id;
            const linkWordId = $linkFlag[1];
            
            // Update the XML store with new references
            if ($xml) {
                const linkWordElement = $xml.getElementById(linkWordId);
                const refWordElement = $xml.getElementById(refWordId);
                
                if (linkWordElement) {
                    const existingRef = linkWordElement.getAttribute('ref') || '[]';
                    const updatedRef = JSON.stringify([...JSON.parse(existingRef), refWordId]);
                    linkWordElement.setAttribute('ref', updatedRef);
                }
                
                if (refWordElement) {
                    const existingRef = refWordElement.getAttribute('ref') || '[]';
                    const updatedRef = JSON.stringify([...JSON.parse(existingRef), linkWordId]);
                    refWordElement.setAttribute('ref', updatedRef);
                }
                
                // Update the store to trigger reactivity
                xml.set($xml);
                if (!e.ctrlKey) {
                    $linkFlag[0] = false; // Reset the flag if CTRL is not pressed
                }
            }
        }
    }

    let allClass = $linkFlag[0] ? className.concat(" cursor-pointer") : className;
    allClass = node.hasAttribute('note') ? allClass.concat(" underline decoration-indigo-500 decoration-2") : allClass;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events-->
<svelte:element
    this={tag}
    class={allClass}
    {...attributes}
    on:mouseover={e => handleRefHighlight(e, 'add')}
    on:mouseleave={e => handleRefHighlight(e, 'remove')}
    on:click={linkWord}>
    <slot/>
</svelte:element>
