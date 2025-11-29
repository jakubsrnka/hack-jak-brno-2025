<script lang="ts">
  import { Checkbox as CheckboxPrimitive } from 'bits-ui';
  import { Check, Minus } from 'lucide-svelte';
  import { cn } from '$lib/utils.js';

  type Props = CheckboxPrimitive.RootProps & {
    ref?: HTMLButtonElement | null;
  };

  let {
    ref = $bindable(null),
    class: className,
    checked = $bindable(false),
    ...restProps
  }: Props = $props();
</script>

<CheckboxPrimitive.Root
  bind:ref
  bind:checked
  class={cn(
    'border-primary ring-offset-background focus-visible:ring-ring data-[disabled=true]:cursor-not-allowed data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[disabled=true]:opacity-50 peer size-4 shrink-0 rounded-sm border shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1',
    className
  )}
  {...restProps}
>
  <CheckboxPrimitive.Indicator class="flex items-center justify-center text-current">
    {#snippet child({ isChecked, isIndeterminate })}
      {#if isIndeterminate}
        <Minus class="size-3.5" />
      {:else if isChecked}
        <Check class="size-3.5" />
      {/if}
    {/snippet}
  </CheckboxPrimitive.Indicator>
</CheckboxPrimitive.Root>
