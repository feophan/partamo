import { writable } from 'svelte/store';

const defaultLangs = [
    { value: "en", label: "English" },
    { value: "it", label: "Italian" },
    { value: "qy", label: "Quenya" }
];

// Get the value out of storage on load.
const storedLangs = JSON.parse(localStorage.langs);

// Set the stored value or a sane default.
export const langs = writable(storedLangs || defaultLangs);

// Anytime the store changes, update the local storage value.
langs.subscribe((value) => localStorage.langs = JSON.stringify(value));