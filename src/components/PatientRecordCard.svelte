<script lang="ts">
  import type { PatientRecordsRecord } from '$types/pocketbase';
  import * as Card from '$components/ui/card/index.js';
  import * as Accordion from '$components/ui/accordion/index.js';
  import { formatDateTime } from '$lib/utils';
  import type { KeyPart } from '$types/openai';
  let {
    patientRecord,
    openRecordIds = $bindable(),
    isOpen = $bindable(),
    searchQuery = '',
    hoveredCitation = $bindable(),
    keyParts
  }: {
    patientRecord: PatientRecordsRecord;
    openRecordIds?: Set<string>;
    isOpen?: boolean;
    searchQuery?: string;
    hoveredCitation?: string | null;
    keyParts: KeyPart[];
  } = $props();

  let value = $state<string | undefined>(isOpen ? 'item-1' : undefined);
  let highlightedSummary = $state('');
  let highlightedText = $state('');

  console.log(keyParts);

  function applyDefaultUnderlines(text: string): string {
    if (!text) return '';

    let result = text;

    keyParts.forEach((part) => {
      let citation = part.citation;
      if (citation) {
        // Remove starting and ending quotes
        let cleanedCitation = citation.trim();
        if (
          (cleanedCitation.startsWith('"') && cleanedCitation.endsWith('"')) ||
          (cleanedCitation.startsWith("'") && cleanedCitation.endsWith("'"))
        ) {
          cleanedCitation = cleanedCitation.slice(1, -1);
        }

        const trimmedCitation = cleanedCitation.trim().toLowerCase();
        if (trimmedCitation) {
          // Escape special regex characters and allow flexible whitespace matching
          const escapedCitation = trimmedCitation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const flexibleCitation = escapedCitation.replace(/\s+/g, '\\s+');

          // Find matches case-insensitively in the original text (all occurrences)
          const tempRegex = new RegExp(flexibleCitation, 'gi');
          const matches = result.match(tempRegex);

          if (matches) {
            // Determine underline color based on importance
            const importance = part.importance || 0;
            let underlineColor = 'decoration-green-500'; // default for importance >= 3
            if (importance === 1) {
              underlineColor = 'decoration-red-500';
            } else if (importance === 2) {
              underlineColor = 'decoration-yellow-500';
            }

            // Replace all matches with colored underlined version
            result = result.replace(
              tempRegex,
              `<u class="underline decoration-2 ${underlineColor}">$&</u>`
            );
          }
        }
      }
    });

    return result;
  }

  function highlightText(text: string | undefined, query: string, citation: string | null): string {
    if (!text) return '';

    // Start with underlined citations
    let result = applyDefaultUnderlines(text);

    // Highlight hovered citation first (so it takes precedence)
    if (citation) {
      console.log('Highlighting citation:', citation);
      // Find the matching key part to get its importance
      const matchingPart = keyParts.find((part) => part.citation === citation);
      const importance = matchingPart?.importance || 0;

      // Determine background color based on importance
      let bgColor = 'bg-green-500'; // default for importance >= 3
      if (importance === 1) {
        bgColor = 'bg-red-500';
      } else if (importance === 2) {
        bgColor = 'bg-yellow-500';
      }

      // Remove starting and ending quotes
      let cleanedCitation = citation.trim();
      if (
        (cleanedCitation.startsWith('"') && cleanedCitation.endsWith('"')) ||
        (cleanedCitation.startsWith("'") && cleanedCitation.endsWith("'"))
      ) {
        cleanedCitation = cleanedCitation.slice(1, -1);
      }

      const trimmedCitation = cleanedCitation.trim().toLowerCase();
      if (trimmedCitation) {
        // Escape special regex characters and allow flexible whitespace matching
        const escapedCitation = trimmedCitation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const flexibleCitation = escapedCitation.replace(/\s+/g, '\\s+');

        // Find matches case-insensitively in the original text (all occurrences)
        const tempRegex = new RegExp(flexibleCitation, 'gi');
        const matches = result.match(tempRegex);
        console.log('Matches found:', matches);

        if (matches) {
          // Replace all matches with highlighted version using importance-based color
          result = result.replace(tempRegex, `<mark class="${bgColor} text-white">$&</mark>`);
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
