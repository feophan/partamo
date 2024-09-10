import { writable } from 'svelte/store';

// Languages

const defaultLangs = [
    { value: "en", label: "English" },
    { value: "it", label: "Italian" },
    { value: "qy", label: "Quenya" }
];

/// Get the value out of storage on load.
const storedLangs = localStorage.langs ? JSON.parse(localStorage.langs) : null;

/// Set the stored value or a sane default.
export const langs = writable(storedLangs || JSON.stringify(defaultLangs));

/// Anytime the store changes, update the local storage value.
langs.subscribe((value) => localStorage.langs = JSON.stringify(value));

// XML tags

const defaultTags = [
    { name: 'head', htmlTag: 'h1', className: 'text-blue-500 font-bold' },
    { name: 'head', type: 'main', htmlTag: 'h1', className: 'text-blue-500 font-bold' },
    { name: 'head', type: 'sub', htmlTag: 'h2', className: 'text-sky-500 italic' },
    { name: 'p', htmlTag: 'p', className: 'before:content-[attr(data-n)] -indent-4 before:pr-2 before:text-slate-300' },
    { name: 'emph', htmlTag: 'span', className: 'italic' },
    { name: 'w', htmlTag: 'span', className: 'hover:bg-sky-500 hover:text-zinc-100 hover:rounded hover:px-1 inline-flex' }
    ];

/// Get the value out of storage on load.
const storedTags = localStorage.tags ? JSON.parse(localStorage.tags) : null;

/// Set the stored value or a sane default.
export const tags = writable(storedTags || JSON.stringify(defaultTags));

/// Anytime the store changes, update the local storage value.
tags.subscribe((value) => localStorage.tags = JSON.stringify(value));