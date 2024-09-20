<script lang="ts">
    import OpenProject from './openProject.svelte';
    import SaveProject from './saveProject.svelte';
    import SettingProject from './settingBlock.svelte';
    import ChapterList from './chapterList.svelte';
    import LangBar from './langBar.svelte';
    import Version from './versionControl.svelte';
    import Glossary from './glossaryOpen.svelte';
</script>

<div class="h-screen fixed w-44 bg-primary grid grid-cols-5 justify-center">
    <div class="border-r border-secondary/10 h-screen flex flex-col justify-center w-10">
        <div class="self-center flex flex-col max-h">
            <OpenProject />
            <LangBar />
            <Glossary />
            <SaveProject />
            <SettingProject />
        </div>
    </div>
    <div class="col-span-4 pl-4 pt-24">
        <Version />
        <div class="text-primary-foreground flex flex-col gap-4 justify-start justify-items-start">
           <ChapterList />
        </div>
    </div>
</div>

<style>
    /* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 15px;
}

*::-webkit-scrollbar-track {
  background: var(--primary);
  border-radius: 5px;
}

*::-webkit-scrollbar-thumb {
  background-color: var(--secondary);
  border-radius: 14px;
  border: 3px solid var(--primary);
}
</style>