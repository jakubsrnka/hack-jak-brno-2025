<script lang="ts">
  import type { KeyPart } from '$types/openai';
  import * as Card from '$components/ui/card/index.js';
  import { Badge } from '$components/ui/badge/index.js';

  let {
    keyPart,
    hoveredCitation = $bindable()
  }: { keyPart: KeyPart; hoveredCitation?: string | null } = $props();

  const importanceColor = $derived(
    keyPart.importance === 1
      ? 'bg-red-500'
      : keyPart.importance === 2
        ? 'bg-yellow-500'
        : 'bg-green-500'
  );
</script>

<Card.Root class="py-3 transition-shadow hover:shadow-[inset_0_0_0_4px_rgba(228,231,255,0.1)]">
  <Card.Header
    class="px-3"
    onmouseenter={() => (hoveredCitation = keyPart.citation)}
    onmouseleave={() => (hoveredCitation = null)}
  >
    <Card.Title class="flex justify-between items-center">
      {keyPart.reason}
      <span>
        <div class="w-5 h-5 rounded-2xl" style:background-color={importanceColor}></div>
      </span>
    </Card.Title>
    <Card.Description>
      <Badge variant="default" class={'text-white ' + importanceColor}>{keyPart.type}</Badge>
    </Card.Description>
  </Card.Header>
</Card.Root>
