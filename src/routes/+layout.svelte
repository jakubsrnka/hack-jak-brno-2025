<script lang="ts">
  import { Toaster } from 'svelte-sonner';
  import UploadDocumentDialog from '$components/UploadDocumentDialog.svelte';
  import { uploadDocumentDialogOpen } from '$lib/stores/dialog';
  import { ModeWatcher } from 'mode-watcher';
  import { onMount } from 'svelte';
  import { currentUser } from '$lib/pocketbase';
  import { initializeTheme } from '$lib/stores/theme';
  import '../app.css';

  let { children } = $props();

  onMount(() => {
    initializeTheme($currentUser);
  });
</script>

<svelte:head>
  <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
  <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
  <link rel="shortcut icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
  <meta name="apple-mobile-web-app-title" content="Docuhelper" />
  <link rel="manifest" href="/favicon/site.webmanifest" />
</svelte:head>

<Toaster richColors />
<ModeWatcher track={false} defaultMode="light" />
{@render children()}
<UploadDocumentDialog bind:open={$uploadDocumentDialogOpen} />
