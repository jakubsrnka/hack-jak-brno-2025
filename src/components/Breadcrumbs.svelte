<script lang="ts">
  import { page } from '$app/state';
  import * as Breadcrumb from '$components/ui/breadcrumb';
  import { breadcrumbItems } from '$lib/stores';
  import type { BreadcrumbItem } from '$types/breadcrumbs';

  const buildBreadcrumbs = (
    segments: string[],
    items: Record<string, BreadcrumbItem> | undefined,
    basePath: string = ''
  ): BreadcrumbItem[] => {
    if (segments.length === 0) {
      return [];
    }

    const currentSegment = segments[0];
    const currentPath = `${basePath}/${currentSegment}`;
    const currentItem = items?.[currentSegment];

    // If item exists in the store, use it; otherwise create from segment
    const breadcrumbItem: BreadcrumbItem = currentItem || {
      name: currentSegment.charAt(0).toUpperCase() + currentSegment.slice(1),
      href: currentPath
    };

    // Recursively build breadcrumbs for remaining segments
    const remainingBreadcrumbs = buildBreadcrumbs(
      segments.slice(1),
      currentItem?.items,
      currentPath
    );

    return [breadcrumbItem, ...remainingBreadcrumbs];
  };

  let breadcrumbs = $derived(
    (() => {
      const pathname = page.url.pathname;
      const segments = pathname.split('/').filter(Boolean);
      const result: BreadcrumbItem[] = [];

      result.push({ name: $breadcrumbItems.name, href: '/' });

      return result.concat(buildBreadcrumbs(segments, $breadcrumbItems?.items));
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
