import { writable } from 'svelte/store';

export const subMenuStore = writable<{ title: string; url: string }[]>([]);
