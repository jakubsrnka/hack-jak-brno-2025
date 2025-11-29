<script lang="ts">
  import { Toaster } from 'svelte-sonner';
  import favicon from '$lib/assets/favicon.svg';
  import '../app.css';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<Toaster richColors />
{@render children()}
