import { writable, type Writable } from 'svelte/store';

// Additional stores
export const xml: Writable<null | Document> = writable(null);
export const lang: Writable<string[]> = writable(['en']);
export const chapter: Writable<string> = writable('1');
export const fileUploaded = writable<boolean>(false);