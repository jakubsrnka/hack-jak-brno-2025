<script lang="ts">
  import * as Sidebar from '$components/ui/sidebar/index.js';
  import AppSidebar from '$components/AppSidebar.svelte';

  let { children } = $props();
</script>

<Sidebar.Provider>
  <AppSidebar />
  <main class="flex flex-col w-full p-3">
    <Sidebar.Trigger />
    {@render children()}
  </main>
</Sidebar.Provider>
