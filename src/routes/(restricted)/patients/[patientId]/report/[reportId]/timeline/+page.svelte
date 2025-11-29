<script lang="ts">
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import { getPatientRecords } from '$lib/services';
  import type { PatientRecordsResponse } from '$types/pocketbase';
  import * as Card from '$components/ui/card';
  import { Button } from '$components/ui/button';
  import { goto } from '$app/navigation';
  import ArrowLeftIcon from 'lucide-svelte/icons/arrow-left';
  import CalendarIcon from 'lucide-svelte/icons/calendar';
  import FileTextIcon from 'lucide-svelte/icons/file-text';
  import { formatShortDate, formatWordDate } from '$lib/helpers/date';

  let reportId = page.params.reportId;
  let patientRecords: PatientRecordsResponse[] = $state([]);

  const sortedRecords = $derived(
    [...patientRecords].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB; // Oldest first
    })
  );

  onMount(async () => {
    if (reportId) {
      patientRecords = await getPatientRecords(reportId);
    }
  });
</script>

<div class="flex flex-col gap-6 pb-6">
  <!-- Header -->
  <div class="sticky top-0 z-50 bg-background py-6 flex items-center justify-between">
    <div class="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        onclick={() => goto(`/patients/${page.params.patientId}/report/${reportId}`)}
      >
        <ArrowLeftIcon class="h-5 w-5" />
      </Button>
      <h1 class="text-2xl font-semibold">Časová osa záznamů</h1>
    </div>
  </div>

  <!-- Timeline -->
  <div class="relative">
    {#each sortedRecords as record, index (record.id)}
      {@const isLast = index === sortedRecords.length - 1}
      <div class="relative flex gap-6 pb-8">
        <!-- Timeline line and dot -->
        <div class="relative flex flex-col items-center">
          <!-- Dot -->
          <div
            class="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-background bg-primary"
          >
            <FileTextIcon class="h-4 w-4 text-primary-foreground" />
          </div>
          <!-- Vertical line -->
          {#if !isLast}
            <div class="absolute top-10 h-full w-0.5 bg-border"></div>
          {/if}
        </div>

        <!-- Content -->
        <div class="flex-1 pt-1">
          <Card.Root class="transition-shadow hover:shadow-md">
            <Card.Header>
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <Card.Title class="text-lg">{record.type}</Card.Title>
                  <Card.Description class="flex items-center gap-2 mt-1 whitespace-normal">
                    <CalendarIcon class="h-3 w-3 shrink-0" />
                    <span>{formatWordDate(record.date)}</span>
                  </Card.Description>
                </div>
                <div
                  class="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                >
                  {formatShortDate(record.date)}
                </div>
              </div>
            </Card.Header>
            {#if record.summary}
              <Card.Content>
                <p class="text-sm text-muted-foreground">
                  {@html record.summary}
                </p>
              </Card.Content>
            {/if}
            <Card.Footer>
              <Button
                variant="outline"
                size="sm"
                onclick={() => {
                  goto(`/patients/${page.params.patientId}/report/${reportId}#${record.id}`);
                }}
              >
                Zobrazit detail
              </Button>
            </Card.Footer>
          </Card.Root>
        </div>
      </div>
    {/each}

    {#if sortedRecords.length === 0}
      <div class="flex flex-col items-center justify-center py-12 text-center">
        <FileTextIcon class="h-12 w-12 text-muted-foreground/50 mb-4" />
        <p class="text-lg font-medium text-muted-foreground">Žádné záznamy</p>
        <p class="text-sm text-muted-foreground/70 mt-1">
          Pro tento report nebyly nalezeny žádné záznamy.
        </p>
      </div>
    {/if}
  </div>
</div>
