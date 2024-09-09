<script lang="ts">
    import { xml, fileUploaded, fileName } from '$lib/stores.js';
    import { buttonVariants } from "$lib/components/ui/button";
    import Upload from "svelte-radix/Upload.svelte";

    let files: FileList;
    let fileInput: HTMLInputElement;

    // Function to handle file reading
    function readFileContent(file: File) {
        const reader = new FileReader();

        reader.onload = () => {
            const book_txt = reader.result as string; // Get the content of the file
            const parser = new DOMParser();
            const doc = parser.parseFromString(book_txt, 'text/xml');
            if (doc.querySelector('parsererror')) {
                console.error('Error parsing XML');
                return;
            }
            xml.set(doc);
            fileUploaded.set(true); // Set the fileUploaded store to true
            fileName.set(files[0].name);
            // console.log(files[0].name.replace(/\.xml$/, ""));

            // Manually reset the file input value to allow the same file to be selected again
            fileInput.value = '';
        }

        reader.onerror = () => {
            console.error('File reading failed');
        }

        reader.readAsText(file); // Start reading the file
    }

    // Reactive statement to watch for changes in files
    $: if (files && files.length > 0) {
        readFileContent(files[0]); // Read the first file's content
    }
</script>

{#if $fileUploaded }
    <div>
        <label for="project" class={`${buttonVariants({ variant: "ghost", size: "icon" })} text-primary-foreground hover:text-secondary-foreground`}>
            <Upload class="w-4 h-4"/>
        </label>
        <input
            accept=".xml"
            bind:files
            id="project"
            name="project"
            type="file"
            style="display:none"
            bind:this={fileInput} 
        />
    </div>
{:else}
    <div>
        <label for="project" class={buttonVariants({ variant: "outline" })}>Select Project</label>
        <input
            accept=".xml"
            bind:files
            id="project"
            name="project"
            type="file"
            style="display:none"
            bind:this={fileInput}
        />
    </div>
{/if}
