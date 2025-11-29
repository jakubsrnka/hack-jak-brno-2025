<script lang="ts">
  import type { PatientRecordsRecord } from '$types/pocketbase';
  import * as Card from '$components/ui/card/index.js';
  import * as Accordion from '$components/ui/accordion/index.js';
  import { formatDate } from '$lib/utils';
  import type { KeyPart } from '$types/openai';
  import { Badge } from '$components/ui/badge/index.js';

  let {
    patientRecord,
    openRecordIds = $bindable(),
    isOpen = $bindable(),
    searchQuery = '',
    hoveredCitations = $bindable(),
    keyParts
  }: {
    patientRecord: PatientRecordsRecord;
    openRecordIds?: Set<string>;
    isOpen?: boolean;
    searchQuery?: string;
    hoveredCitations?: string[] | null;
    keyParts: KeyPart[];
  } = $props();

  let value = $state<string | undefined>(isOpen ? 'item-1' : undefined);
  let highlightedSummary = $state('');
  let highlightedText = $state('');

  function applyDefaultUnderlines(text: string, isSummary: boolean = false): string {
    if (!text) return '';
    if (isSummary) return text;

    let result = text;

    keyParts.forEach((part) => {
      let citations = part.citations;
      if (citations) {
        const citationArray = Array.isArray(citations) ? citations : [citations];

        citationArray.forEach((citation) => {
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
            // Support "..." as a wildcard (match anything) and allow flexible whitespace matching
            let flexibleCitation: string;
            if (trimmedCitation.includes('...')) {
              const parts = trimmedCitation
                .split('...')
                .map((p) => p.trim())
                .filter(Boolean);
              const escapedParts = parts.map((p) =>
                p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')
              );
              flexibleCitation = escapedParts.join('.*?');
              if (trimmedCitation.startsWith('...')) {
                flexibleCitation = '.*?' + flexibleCitation;
              }
              if (trimmedCitation.endsWith('...')) {
                flexibleCitation = flexibleCitation + '.*?';
              }
            } else {
              const escapedCitation = trimmedCitation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              flexibleCitation = escapedCitation.replace(/\s+/g, '\\s+');
            }

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
        });
      }
    });

    return result;
  }

  function highlightText(
    text: string | undefined,
    query: string,
    citation: string | null,
    isSummary: boolean = false
  ): string {
    if (!text) return '';

    // Start with underlined citations (skip for summary)
    let result = applyDefaultUnderlines(text, isSummary);

    // Highlight hovered citations (so they take precedence) - skip for summary
    if (citation && !isSummary) {
      console.log('Highlighting citation:', citation);
      // Find the matching key part to get its importance
      const matchingPart = keyParts.find((part) => {
        if (Array.isArray(part.citations)) {
          return part.citations.includes(citation);
        }
        return part.citations === citation;
      });
      const importance = matchingPart?.importance || 0;

      // Determine background color based on importance
      let bgColor = 'bg-green-500'; // default for importance >= 3
      if (importance === 1) {
        bgColor = 'bg-red-500';
      } else if (importance === 2) {
        bgColor = 'bg-yellow-500';
      }

      // Get all citations for this keypart
      const citationsToHighlight = matchingPart?.citations
        ? Array.isArray(matchingPart.citations)
          ? matchingPart.citations
          : [matchingPart.citations]
        : [citation];

      citationsToHighlight.forEach((citationText) => {
        // Remove starting and ending quotes
        let cleanedCitation = citationText.trim();
        if (
          (cleanedCitation.startsWith('"') && cleanedCitation.endsWith('"')) ||
          (cleanedCitation.startsWith("'") && cleanedCitation.endsWith("'"))
        ) {
          cleanedCitation = cleanedCitation.slice(1, -1);
        }

        const trimmedCitation = cleanedCitation.trim().toLowerCase();
        if (trimmedCitation) {
          let flexibleCitation: string;
          if (trimmedCitation.includes('...')) {
            const parts = trimmedCitation
              .split('...')
              .map((p) => p.trim())
              .filter(Boolean);
            const escapedParts = parts.map((p) =>
              p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')
            );
            flexibleCitation = escapedParts.join('.*?');
            if (trimmedCitation.startsWith('...')) {
              flexibleCitation = '.*?' + flexibleCitation;
            }
            if (trimmedCitation.endsWith('...')) {
              flexibleCitation = flexibleCitation + '.*?';
            }
          } else {
            const escapedCitation = trimmedCitation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            flexibleCitation = escapedCitation.replace(/\s+/g, '\\s+');
          }

          // Find matches case-insensitively in the original text (all occurrences)
          const tempRegex = new RegExp(flexibleCitation, 'gi');
          const matches = result.match(tempRegex);

          if (matches) {
            // Replace all matches with highlighted version using importance-based color
            result = result.replace(tempRegex, `<mark class="${bgColor} text-white">$&</mark>`);
          }
        }
      });
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
    highlightedSummary = highlightText(
      patientRecord.summary,
      searchQuery,
      hoveredCitations && hoveredCitations.length > 0 ? hoveredCitations[0] : null,
      true
    );
    highlightedText = highlightText(
      patientRecord.text,
      searchQuery,
      hoveredCitations && hoveredCitations.length > 0 ? hoveredCitations[0] : null,
      false
    );

    console.log('Highlighted Summary:', hoveredCitations);
  });
</script>

<Accordion.Root type="single" bind:value class="w-full">
  <Accordion.Item value="item-1">
    <Card.Root class="gap-2 transition-shadow">
      <Card.Header class="relative gap-1">
        <Card.Title class="flex flex-col gap-2">
          <span>Datum: {formatDate(patientRecord.date)}</span>
          <span>Typ: {patientRecord.type}</span>
        </Card.Title>
        <Accordion.Trigger class="hidden md:flex p-0 gap-1 absolute right-5 top-0.5 cursor-pointer">
          {#if isOpen}
            Sbalit
          {:else}
            Rozbalit
          {/if}
        </Accordion.Trigger>
        {#if patientRecord.summary}
          <Card.Description class="flex flex-col gap-3">
            <span>
              {@html highlightedSummary}
            </span>
            <div class="flex flex-wrap gap-1">
              {#each keyParts as part}
                <Badge
                  variant="default"
                  class="{part.importance === 1
                    ? 'bg-red-500'
                    : part.importance === 2
                      ? 'bg-yellow-500'
                      : 'bg-green-500'} text-white"
                >
                  {part.types}
                </Badge>
              {/each}
            </div>
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
