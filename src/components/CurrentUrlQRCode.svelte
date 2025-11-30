<script lang="ts">
  import QRCodeStyling from 'qr-code-styling';
  import { page } from '$app/state';
  import { onMount } from 'svelte';

  let currentPath = $derived(page.url.pathname);
  let canvasEl: HTMLDivElement;
  let qrCode: QRCodeStyling | null = null;

  onMount(() => {
    const w = canvasEl.offsetWidth;

    qrCode = new QRCodeStyling({
      width: w,
      height: w,
      type: 'svg',
      data: `https://docuhelper.site${currentPath}`,
      dotsOptions: {
        color: 'currentColor',
        type: 'rounded'
      },
      backgroundOptions: {
        color: 'transparent'
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 20
      }
    });

    qrCode.append(canvasEl);
  });

  $effect(() => {
    if (qrCode) {
      qrCode.update({
        data: `https://docuhelper.site${currentPath}`
      });
    }
  });
</script>

<div bind:this={canvasEl} class="w-full"></div>
