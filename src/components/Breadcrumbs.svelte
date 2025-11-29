<script lang="ts">
  import { page } from '$app/state';
  import * as Breadcrumb from '$components/ui/breadcrumb';
  import { breadcrumbItems } from '$lib/stores';
  import type { BreadcrumbItem } from '$types/breadcrumbs';

  function buildBreadcrumbsRecursive(
    segments: string[],
    itemsMap: Record<string, BreadcrumbItem> | undefined,
    index = 0,
    baseHref = ''
  ): BreadcrumbItem[] {
    if (index >= segments.length) return [];

    const segment = segments[index];
    if (!segment) return buildBreadcrumbsRecursive(segments, itemsMap, index + 1, baseHref);

    const href = `${baseHref}/${segment}`.replace(/\/+/g, '/');
    const mapped = itemsMap?.[segment];
    const current: BreadcrumbItem[] = mapped
      ? [{ name: mapped.name, href: mapped.href ?? href }]
      : [{ name: decodeURIComponent(segment), href }];

    return current.concat(buildBreadcrumbsRecursive(segments, itemsMap, index + 1, href));
  }

  let breadcrumbs = $derived(
    (() => {
      const pathname = page.url.pathname;
      const map = $breadcrumbItems;
      const segments = pathname.split('/').filter(Boolean);
      const result: BreadcrumbItem[] = [];

      if (map?.name) {
        result.push({ name: map.name, href: '/' });
      }

      return result.concat(buildBreadcrumbsRecursive(segments, map?.items, 0, ''));
    })()
  );
</script>

<Breadcrumb.Root>
  <Breadcrumb.List>
    {#each breadcrumbs as crumb, i (crumb.href)}
      <Breadcrumb.Item>
        {#if i === breadcrumbs.length - 1}
          <Breadcrumb.Page>{crumb.name}</Breadcrumb.Page>
        {:else}
          <Breadcrumb.Link href={crumb.href}>{crumb.name}</Breadcrumb.Link>
        {/if}
      </Breadcrumb.Item>
      {#if i < breadcrumbs.length - 1}
        <Breadcrumb.Separator />
      {/if}
    {/each}
  </Breadcrumb.List>
</Breadcrumb.Root>
