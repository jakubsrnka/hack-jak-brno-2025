<script lang="ts">
  import QRCodeStyling from 'qr-code-styling';
  import { page } from '$app/state';

  let currentPath = $derived(page.url.pathname);

  $effect(() => {
    let qrCode = new QRCodeStyling({
      width: 220,
      height: 220,
      type: 'svg',
      data: `https://docuhelper.site${currentPath}?t=hjb2025`,
      dotsOptions: {
        color: '#4267b2',
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

    const el = document.getElementById('canvas');
    if (el) {
      el.innerHTML = '';
      qrCode.append(el);
    }
  });
</script>

<div id="canvas" class="w-full"></div>
