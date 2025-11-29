<script lang="ts">
  import * as Card from '$components/ui/card/index.js';

  let { text }: { text: string } = $props();
</script>

<Card.Root class="cursor-pointer gap-2 transition-shadow">
  <Card.Header>
    <Card.Title class="flex flex-col gap-2">Shrnutí</Card.Title>
  </Card.Header>
  <Card.Content>
    {@html text}
  </Card.Content>
</Card.Root>
