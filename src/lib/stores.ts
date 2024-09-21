import { writable, type Writable } from 'svelte/store';

// XML text
export const xml: Writable<null | Document> = writable(null);
export const lang: Writable<string[]> = writable(['en']);
export const chapter: Writable<string> = writable('1');

// File check
export const fileUploaded = writable<boolean>(false);
export const fileName = writable<string>('document');

// Context
export const contextPosition = writable<null | [number, number, Element]>(null);
export const linkFlag = writable<[boolean, string | null]>([false, null]);
export const notePosition = writable<null | [number, number, Element]>(null);