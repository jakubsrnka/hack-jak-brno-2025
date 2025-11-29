<script lang="ts">
  import type { PatientRecordsRecord } from '$types/pocketbase';
  import * as Card from '$components/ui/card/index.js';
  import * as Accordion from '$components/ui/accordion/index.js';
  let {
    patientRecord,
    openRecordIds = $bindable(),
    isOpen = $bindable(),
    searchQuery = ''
  }: {
    patientRecord: PatientRecordsRecord;
    openRecordIds?: Set<string>;
    isOpen?: boolean;
    searchQuery?: string;
  } = $props();

  let value = $state<string | undefined>(isOpen ? 'item-1' : undefined);

  $effect(() => {
    // Sync accordion value to parent isOpen
    if (isOpen !== undefined) {
      const newIsOpen = value === 'item-1';
      if (isOpen !== newIsOpen) {
        isOpen = newIsOpen;
      }
    }
  });

  $effect(() => {
    // Sync parent isOpen to accordion value
    if (isOpen !== undefined) {
      const shouldBeOpen = value === 'item-1';
      if (isOpen !== shouldBeOpen) {
        value = isOpen ? 'item-1' : undefined;
      }
    }
  });

  function highlightText(text: string | undefined, query: string): string {
    if (!text || !query) return text || '';
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<b class="underline">$1</b>');
  }
</script>

<Accordion.Root type="single" bind:value class="w-full">
  <Accordion.Item value="item-1">
    <Card.Root class="gap-2 transition-shadow">
      <Card.Header class="relative gap-0">
        <Card.Title class="flex flex-col gap-0">
          <span>{patientRecord.date}</span>
          <span>{patientRecord.type}</span>
        </Card.Title>
        <Accordion.Trigger class="hidden md:flex p-0 gap-1 absolute right-5 top-0.5 cursor-pointer">
          {#if isOpen}
            Sbalit
          {:else}
            Rozbalit
          {/if}
        </Accordion.Trigger>
        {#if patientRecord.summary}
          <Card.Description>
            {@html highlightText(patientRecord.summary, searchQuery)}
          </Card.Description>
        {/if}
      </Card.Header>
      {#if patientRecord.text}
        <Card.Content>
          <Accordion.Content class="p-0"
            >{@html highlightText(patientRecord.text, searchQuery)}</Accordion.Content
          >
        </Card.Content>
      {/if}
      <Card.Footer class="block md:hidden">
        <Accordion.Trigger class="md:hidden p-0 gap-1 cursor-pointer">
          {#if isOpen}
            Sbalit
          {:else}
            Rozbalit
          {/if}
        </Accordion.Trigger>
      </Card.Footer>
    </Card.Root>
  </Accordion.Item>
</Accordion.Root>
