<script lang="ts">
  import type { KeyPart } from '$types/openai';
  import KeyPartCard from './KeyPartCard.svelte';

  let {
    keyParts,
    hoveredCitations = $bindable()
  }: { keyParts: KeyPart[]; hoveredCitations?: string[] | null } = $props();
</script>

<div class="w-full cursor-pointer flex flex-col gap-2 sticky top-0">
  {#each keyParts as part}
    <KeyPartCard keyPart={part} bind:hoveredCitations />
  {/each}
</div>
