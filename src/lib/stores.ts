import type { BreadcrumbItem } from '$lib/types/breadcrumbs';
import { writable } from 'svelte/store';

export const subMenuStore = writable<{ title: string; url: string }[]>([]);

export const breadcrumbItems = writable<BreadcrumbItem>({
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
