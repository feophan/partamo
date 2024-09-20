<script lang="ts">
  import { onMount } from "svelte";
  import { EditorView, keymap } from "@codemirror/view";
  import { EditorState } from "@codemirror/state";
  import { xml as XMLmirror } from "@codemirror/lang-xml";
  import { defaultKeymap } from "@codemirror/commands";
  import { syntaxHighlighting, HighlightStyle } from "@codemirror/language";
  import { tags } from "@lezer/highlight"; // Import the predefined tag names

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let content: string = ''; // Define type for content
  let editor: HTMLElement | null = null; // Explicitly define editor type
  let editorContent: string = content;

  // Define the custom highlight style using the correct tags
  const customHighlightStyle = HighlightStyle.define([
    { tag: tags.tagName, color: "#00f" }, // Highlight XML tag names in blue
    { tag: tags.attributeName, color: "#080" }, // Highlight attribute names in green
    { tag: tags.attributeValue, color: "#800" }, // Highlight attribute values in red
    { tag: tags.string, color: "#800" }, // Highlight string values in red
    { tag: tags.content, color: "#333" } // Highlight content inside tags
  ]);

  function handleEditorChange(newContent: string) {
        editorContent = newContent;
        dispatch('input', editorContent); // Dispatch the input event with updated content
    }

    onMount(() => {
        if (editor) {
            const state = EditorState.create({
                doc: editorContent, // Use editorContent for initial document
                extensions: [
        XMLmirror(), // XML syntax highlighting
        keymap.of(defaultKeymap), // Basic keymaps
        EditorView.lineWrapping, // Enable line wrapping
        syntaxHighlighting(customHighlightStyle), // Apply custom highlighting
        EditorView.updateListener.of(update => {
          // Handle content changes
          const newContent = update.state.doc.toString();
          handleEditorChange(newContent); // Handle editor change
        })
      ]
    });

    const view = new EditorView({
      state,
      parent: editor,
    });

            return () => {
                view.destroy(); // Clean up on component unmount
            };
        }
    });
</script>

<!-- Editor container -->
<div bind:this={editor} class="xml-editor w-[85vh] h-[60vh] overflow-auto border border-primary" />
