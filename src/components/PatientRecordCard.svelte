<script lang="ts">
  import type { PatientRecordsRecord } from '$types/pocketbase';
  import * as Card from '$components/ui/card/index.js';
  import * as Accordion from '$components/ui/accordion/index.js';
  import { formatDateTime } from '$lib/utils';
  let {
    patientRecord,
    openRecordIds = $bindable(),
    isOpen = $bindable(),
    searchQuery = '',
    hoveredCitation = $bindable()
  }: {
    patientRecord: PatientRecordsRecord;
    openRecordIds?: Set<string>;
    isOpen?: boolean;
    searchQuery?: string;
    hoveredCitation?: string | null;
  } = $props();

  let value = $state<string | undefined>(isOpen ? 'item-1' : undefined);
  let highlightedSummary = $state('');
  let highlightedText = $state('');

  function highlightText(text: string | undefined, query: string, citation: string | null): string {
    if (!text) return '';

    let result = text;

    // Highlight hovered citation first (so it takes precedence)
    if (citation) {
      console.log('Highlighting citation:', citation);
      const trimmedCitation = citation.trim().toLowerCase();
      if (trimmedCitation) {
        // Escape special regex characters and allow flexible whitespace matching
        const escapedCitation = trimmedCitation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const flexibleCitation = escapedCitation.replace(/\s+/g, '\\s+');

        // Find only the first match case-insensitively in the original text
        const tempRegex = new RegExp(flexibleCitation, 'i');
        const match = result.match(tempRegex);
        console.log('First match found:', match);

        if (match) {
          // Replace only the first match with highlighted version
          result = result.replace(tempRegex, '<mark class="bg-yellow-300 font-bold">$&</mark>');
        }
      }
    }

    // Highlight search query
    if (query) {
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      result = result.replace(regex, '<b class="underline">$1</b>');
    }

    return result;
  }

  $effect(() => {
    if (isOpen !== undefined) {
      const accordionIsOpen = value === 'item-1';

      // Sync accordion to parent
      if (isOpen !== accordionIsOpen) {
        isOpen = accordionIsOpen;
      }

      // Sync parent to accordion
      if (accordionIsOpen !== isOpen) {
        value = isOpen ? 'item-1' : undefined;
      }
    }
    highlightedSummary = highlightText(patientRecord.summary, searchQuery, hoveredCitation ?? null);
    highlightedText = highlightText(patientRecord.text, searchQuery, hoveredCitation ?? null);
  });
</script>

<Accordion.Root type="single" bind:value class="w-full">
  <Accordion.Item value="item-1">
    <Card.Root class="gap-2 transition-shadow">
      <Card.Header class="relative gap-1">
        <Card.Title class="flex flex-col gap-2">
          <span>{formatDateTime(patientRecord.date)}</span>
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
            {@html highlightedSummary}
          </Card.Description>
        {/if}
      </Card.Header>
      {#if patientRecord.text}
        <Card.Content>
          <Accordion.Content class="p-0">{@html highlightedText}</Accordion.Content>
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
