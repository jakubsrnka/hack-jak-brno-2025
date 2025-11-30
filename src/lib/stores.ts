import type { BreadcrumbItem } from '$lib/types/breadcrumbs';
import { writable } from 'svelte/store';
import { persisted } from 'svelte-persisted-store';

export const subMenuStore = writable<{ title: string; url: string }[]>([]);

export const breadcrumbItems = persisted<BreadcrumbItem>('breadcrumbItems', {
  name: 'Domů',
  href: '/',
  items: {
    patients: {
      name: 'Pacienti',
      href: '/patients'
    },
    settings: {
      name: 'Nastavení',
      href: '/settings'
    }
  }
});
