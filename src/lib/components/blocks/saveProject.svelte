<script lang="ts">
  let fileName = "document.xml"; // The name of the file to download
  import { xml } from '$lib/stores.js';
  import { Button } from "$lib/components/ui/button/index.js";
  import Download from "svelte-radix/Download.svelte";
  
  // Sample document content
  $: book = $xml;

  let doc: string = '';

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
              if (minorVersionAttr !== null) {
                  let vMinor = parseInt(minorVersionAttr, 10); // Ensure to use base 10
                  vMinor += 1; // Increment the minor version (instead of doubling it)
                  version.setAttribute('minor', vMinor.toString());
                  console.log(version);
                  
                  // Update the xml store to reflect this change
                  xml.set(book); // This updates the store with the modified document
                  console.error("Updated version");

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
      const blob = new Blob([doc], { type: "text/xml" });

      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);

      // Create a temporary link element
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;

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
<Button on:click={downloadDocument} variant="ghost" size="icon" class="text-primary-foreground hover:text-secondary-foreground">
  <Download class="w-4 h-4"/>
</Button>
