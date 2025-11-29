<script lang="ts">
  import * as Sidebar from '$components/ui/sidebar/index.js';
  import AppSidebar from '$components/AppSidebar.svelte';
  import Breadcrumbs from '$components/Breadcrumbs.svelte';
  import { page } from '$app/state';

  let { children } = $props();
</script>

<Sidebar.Provider>
  <AppSidebar />
  <main class="flex flex-col w-full p-3">
    <div class="flex items-center gap-4 flex-wrap">
      <Sidebar.Trigger />
      {#if page.url.pathname !== '/'}
        <Breadcrumbs />
      {/if}
    </div>
    <div class="pt-2 md:p-4 lg:p-8">
      {@render children()}
    </div>
  </main>
</Sidebar.Provider>
