<script lang="ts">
  import * as Card from '$components/ui/card/index.js';

  let { keyParts }: { keyParts: string[] } = $props();
</script>

<Card.Root class="h-full w-full cursor-pointer gap-2">
  <Card.Content>
    <ul class="list-disc list-inside">
      {#each keyParts as part}
        <li>{part}</li>
      {/each}
    </ul>
  </Card.Content>
</Card.Root>
