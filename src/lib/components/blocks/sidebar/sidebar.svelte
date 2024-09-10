<script lang="ts">
    import OpenProject from './openProject.svelte';
    import SaveProject from './saveProject.svelte';
    import SettingProject from './settingBlock.svelte';
    import ChapterList from './chapterList.svelte';
    import LangBar from './langBar.svelte';
    import Version from './versionControl.svelte';
</script>

<div class="h-screen pb-12 pt-24 lg:block fixed w-40 bg-primary">
    <Version />   
    <div class="text-primary-foreground px-4 flex flex-col gap-4 justify-start justify-items-start">
       <ChapterList />
    </div>
    <div class="fixed bottom-0 flex flex-row justify-around w-max">
        <OpenProject />
        <LangBar />
        <SaveProject />
        <SettingProject />
    </div>
</div>