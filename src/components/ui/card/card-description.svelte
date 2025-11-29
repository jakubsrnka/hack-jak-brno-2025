<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn, type WithElementRef } from '$lib/utils.js';

  let {
    ref = $bindable(null),
    class: className,
    children,
    title,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLParagraphElement>> = $props();
</script>

<p
  bind:this={ref}
  data-slot="card-description"
  class={cn('text-muted-foreground text-sm w-full overflow-hidden text-ellipsis whitespace-nowrap', className)}
  {title}
  {...restProps}
>
  {@render children?.()}
</p>
