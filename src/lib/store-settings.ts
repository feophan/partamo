import { writable } from 'svelte/store';
import { SettingsManager } from 'tauri-settings';

export type Lang = {
  value: string;
  label: string;
};

type Tag = {
  name: string;
  type?: string;
  htmlTag: string;
  className: string;
};

type Schema = {
  langs: Lang[];
  tags: Tag[];
};

const defaultLangs: Lang[] = [
  { value: "en", label: "English" },
  { value: "it", label: "Italian" },
  { value: "qy", label: "Quenya" }
];

const defaultTags: Tag[] = [
  { name: 'head', htmlTag: 'h1', className: 'text-blue-500 font-bold' },
  { name: 'head', type: 'sub', htmlTag: 'h2', className: 'text-sky-500 italic' },
  { name: 'head', type: 'main', htmlTag: 'h1', className: 'text-blue-500 font-bold' },
  { name: 'p', htmlTag: 'p', className: 'before:content-[attr(data-n)] -indent-4 before:pr-2 before:text-slate-300' },
  { name: 'emph', htmlTag: 'span', className: 'italic' },
  { name: 'w', htmlTag: 'span', className: 'hover:bg-sky-500 hover:text-zinc-100 hover:rounded hover:outline hover:outline-2 hover:outline-sky-500' }
];

// Initialize the settings manager
const settingsManager = new SettingsManager<Schema>(
  { // defaults
    langs: defaultLangs,
    tags: defaultTags,
  },
  { // options
    fileName: 'user-settings'
  }
);

// Function to load settings
async function loadSettings() {
  await settingsManager.initialize();

  const langs = settingsManager.getCache('langs');
  const tags = settingsManager.getCache('tags');
  
  return { langs, tags };
}

// Function to save settings
async function saveSettings(key: keyof Schema, value: Lang[] | Tag[]) {
  settingsManager.setCache(key, value);
  await settingsManager.syncCache(); // Ensure changes are written to the settings file
}

// Load settings on initialization and set up Svelte stores
const { langs: storedLangs, tags: storedTags } = await loadSettings();

export const langs = writable<Lang[]>(storedLangs || defaultLangs);
export const tags = writable<Tag[]>(storedTags || defaultTags);

// Subscribe to store changes and save settings
langs.subscribe(async (value) => {
  await saveSettings('langs', value);
});

tags.subscribe(async (value) => {
  await saveSettings('tags', value);
});
