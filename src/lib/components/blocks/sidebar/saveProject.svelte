<script lang="ts">
    import { xml, fileName } from '$lib/stores.js';
    import { Button } from "$lib/components/ui/button/index.js";
    import Download from "svelte-radix/Download.svelte";
    import * as Tooltip from "$lib/components/ui/tooltip";
    
    // Sample document content
    $: book = $xml;
    $: name = $fileName;
  
    let doc: string = '';
    let minorVersion: string | null = null; // Store the minor version number
    let majorVersion: string | null = null; // Store the minor version number
  
    $: if (book != null) {
        doc = book.documentElement.outerHTML;
    }
  
    function submitRevision() {
        if (book) {
            // Find the <version> element in the XML document
            const version = book.querySelector("version");
            if (version) {
                // Get the 'minor' attribute, handling the case where it might be null
                const minorVersionAttr = version.getAttribute('minor');
                const majorVersionAttr = version.getAttribute('major');
                if (minorVersionAttr !== null) {
                    let vMinor = parseInt(minorVersionAttr, 10); // Ensure to use base 10
                    vMinor += 1; // Increment the minor version (instead of doubling it)
                    version.setAttribute('minor', vMinor.toString());                    
                    // Update the xml store to reflect this change
                    xml.set(book); // This updates the store with the modified document
                    minorVersion = vMinor.toString(); // Update minor version for file name
                    majorVersion = majorVersionAttr; // Update major version for file name
                    // Update the doc variable with the new XML content
                    doc = book.documentElement.outerHTML;
                } else {
                    console.error("The 'minor' attribute does not exist.");
                }
            } else {
                console.error("No version element found.");
            }
        } else {
            console.error("Invalid word ID or XML document.");
        }
    }
  
    // Function to create and download the file
    function downloadDocument() {
        submitRevision();
        
        // Create a Blob from the updated document content
        const blob = new Blob([doc], { type: "application/xml" });
  
        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);
  
        // Create the new file name by appending the version before the extension
        const versionedName = minorVersion ? (name.replace(/_v\d+-\d+\.xml$/, '').replace(/\.xml$/, '') + `v${majorVersion}-${minorVersion}.xml`) : name;
  
        // Create a temporary link element
        const a = document.createElement("a");
        a.href = url;
        a.download = versionedName;
  
        // Append the link to the document and click it to trigger download
        document.body.appendChild(a);
        a.click();
  
        // Remove the link after downloading
        document.body.removeChild(a);
  
        // Revoke the object URL to free up memory
        URL.revokeObjectURL(url);
    }
  </script>
  
  <!-- Button to trigger the download -->  
  <Tooltip.Root>
      <Tooltip.Trigger><Button on:click={downloadDocument} variant="ghost" size="icon" class="text-primary-foreground hover:text-secondary-foreground">
          <Download class="w-4 h-4"/>
        </Button></Tooltip.Trigger>
      <Tooltip.Content>
          <p>Save project</p>
      </Tooltip.Content>
  </Tooltip.Root>