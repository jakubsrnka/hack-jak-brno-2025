<script lang="ts">
  import { Toaster } from 'svelte-sonner';
  import favicon from '$lib/assets/favicon.svg';
  import * as Sidebar from '$components/ui/sidebar/index.js';
  import AppSidebar from '$components/AppSidebar.svelte';
  import UploadDocumentDialog from '$components/UploadDocumentDialog.svelte';
  import { uploadDocumentDialogOpen } from '$lib/stores/dialog';
  import '../app.css';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<Toaster richColors />
{@render children()}
<UploadDocumentDialog bind:open={$uploadDocumentDialogOpen} />
