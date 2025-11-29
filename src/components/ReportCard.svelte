<script lang="ts">
  import * as Card from '$components/ui/card';
  import { CalendarArrowUp } from 'lucide-svelte';
  import { getLocale } from '$lib/paraglide/runtime';
  import { m } from '$lib/paraglide/messages';

  interface Props {
    patientName?: string;
    created: string;
    shortSummary?: string;
    onclick?: () => void;
  }

  let { patientName, created, shortSummary, onclick }: Props = $props();
</script>

<Card.Root {onclick} class="cursor-pointer hover:shadow-lg transition-shadow">
  <Card.Header class="flex flex-col gap-4">
    <Card.Title class="flex justify-between items-center gap-2 w-full">
      {#if patientName}
        {patientName}
      {/if}
      {#if created}
        <div>
          <div class="text-sm font-medium flex items-center gap-2 text-muted-foreground">
            <CalendarArrowUp class="size-4" />
            {new Date(created).toLocaleDateString(getLocale(), {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </div>
        </div>
      {/if}
    </Card.Title>
  </Card.Header>
  <Card.Content>
    {#if shortSummary}
      <div>
        <div class="text-xs font-semibold text-muted-foreground uppercase">
          {m.reports_shortSummary()}
        </div>
        <div class="text-sm font-medium line-clamp-4">
          {@html shortSummary}
        </div>
      </div>
    {/if}
  </Card.Content>
</Card.Root>
