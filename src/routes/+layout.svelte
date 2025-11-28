<script lang="ts">
  import favicon from '$lib/assets/favicon.svg';
  import * as Sidebar from '$components/ui/sidebar/index.js';
  import AppSidebar from '$components/AppSidebar.svelte';
  import '../app.css';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<Sidebar.Provider>
  <AppSidebar />
  <main class="flex flex-col w-full p-3">
    <Sidebar.Trigger />
    {@render children()}
  </main>
</Sidebar.Provider>
