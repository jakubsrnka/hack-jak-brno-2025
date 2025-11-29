<script lang="ts">
  import { Check, ChevronsUpDown, Calendar } from 'lucide-svelte';
  import { type PatientsResponse } from '$types/pocketbase';
  import { Skeleton } from '$components/ui/skeleton';
  import * as Popover from '$components/ui/popover';
  import * as Command from '$components/ui/command';
  import { Button } from '$components/ui/button';
  import ReportCard from '$components/ReportCard.svelte';
  import { RangeCalendar } from '$components/ui/range-calendar';
  import { cn } from '$lib/utils';
  import { getLocale } from '$lib/paraglide/runtime';
  import type { DateRange } from 'bits-ui';
  import { m } from '$lib/paraglide/messages';

  interface Props {
    data: any[];
    onRowClick?: (row: any) => void;
    patients: Promise<PatientsResponse[]>;
  }

  let { data, onRowClick, patients }: Props = $props();

  let selectedPatients = $state<string[]>([]);
  let isOpen = $state(false);
  let dateRange = $state<DateRange | undefined>(undefined);
  let isCalendarOpen = $state(false);

  function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }

  function getPatientName(item: any): string {
    return getNestedValue(item, 'expand.patient.uuid') || 'Unknown Patient';
  }

  function togglePatientSelection(patientUuid: string) {
    selectedPatients = selectedPatients.includes(patientUuid)
      ? selectedPatients.filter((uuid) => uuid !== patientUuid)
      : [...selectedPatients, patientUuid];
  }

  function isPatientVisible(item: any): boolean {
    const patientUuid = getNestedValue(item, 'expand.patient.uuid');
    const isPatientSelected =
      selectedPatients.length === 0 || selectedPatients.includes(patientUuid);

    if (!isPatientSelected) return false;

    if (!dateRange?.start) return true;

    const itemDate = new Date(item.created);
    const startDate = new Date(
      dateRange.start.year,
      dateRange.start.month - 1,
      dateRange.start.day
    );
    const endDate = dateRange.end
      ? new Date(dateRange.end.year, dateRange.end.month - 1, dateRange.end.day)
      : startDate;

    return itemDate >= startDate && itemDate <= endDate;
  }

  function formatDateRange(): string {
    if (!dateRange?.start) return m.reports_selectDates();

    const startDate = new Date(
      dateRange.start.year,
      dateRange.start.month - 1,
      dateRange.start.day
    );
    const start = startDate.toLocaleDateString(getLocale(), {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    if (!dateRange.end) return start;

    const endDate = new Date(dateRange.end.year, dateRange.end.month - 1, dateRange.end.day);
    const end = endDate.toLocaleDateString(getLocale(), {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    return `${start} - ${end}`;
  }
</script>

<div class="space-y-4">
  <div class="flex items-center gap-2 flex-wrap">
    {#await patients}
      <Skeleton class="h-10 w-[200px]" />
    {:then patientsList}
      <Popover.Root bind:open={isOpen}>
        <Popover.Trigger>
          <Button
            variant="outline"
            class="w-[200px] justify-between"
            role="combobox"
            aria-expanded={isOpen}
          >
            {selectedPatients.length > 0
              ? `${selectedPatients.length} selected`
              : m.reports_selectPatients()}
            <ChevronsUpDown class="ms-2 size-4 shrink-0 opacity-50" />
          </Button>
        </Popover.Trigger>
        <Popover.Content class="w-[200px] p-0">
          <Command.Root>
            <Command.Input placeholder={m.reports_searchPatients()} />
            <Command.List>
              <Command.Empty>{m.reports_noPatientsFound()}</Command.Empty>
              <Command.Group>
                {#each patientsList as patient (patient.uuid)}
                  <Command.Item
                    value={patient.uuid}
                    onSelect={() => togglePatientSelection(patient.uuid)}
                  >
                    <Check
                      class={cn(
                        'me-2 size-4',
                        selectedPatients.includes(patient.uuid) ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {patient.uuid}
                  </Command.Item>
                {/each}
              </Command.Group>
            </Command.List>
          </Command.Root>
        </Popover.Content>
      </Popover.Root>
    {/await}

    <Popover.Root bind:open={isCalendarOpen}>
      <Popover.Trigger>
        <Button variant="outline" class="w-[250px] justify-between">
          <div class="flex items-center gap-2">
            <Calendar class="size-4" />
            <span>{formatDateRange()}</span>
          </div>
        </Button>
      </Popover.Trigger>
      <Popover.Content class="w-auto p-0" align="start">
        <RangeCalendar bind:value={dateRange} />
      </Popover.Content>
    </Popover.Root>
  </div>

  <!-- Reports Grid -->
  {#if data.length === 0}
    <div class="text-center py-12 text-muted-foreground">{m.reports_noResults()}</div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each data as item, idx (idx)}
        {#if isPatientVisible(item)}
          <ReportCard
            patientName={getPatientName(item)}
            created={item.created}
            shortSummary={item.shortSummary}
            onclick={() => onRowClick?.(item)}
          />
        {/if}
      {/each}
    </div>
  {/if}
</div>
