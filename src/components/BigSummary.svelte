<script lang="ts">
  import * as Card from '$components/ui/card/index.js';

  let { text }: { text?: string | null } = $props();
</script>

<Card.Root class="gap-2 transition-shadow">
  <Card.Header>
    <Card.Title class="flex flex-col gap-2">Shrnutí</Card.Title>
  </Card.Header>
  <Card.Content>
    {#if text && text.trim().length > 0}
      {@html text}
    {:else}
      <div class="text-sm text-muted-foreground">Data shrnutí se načítají...</div>
    {/if}
  </Card.Content>
</Card.Root>
