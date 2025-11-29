<script lang="ts">
  import { Check, ChevronsUpDown } from 'lucide-svelte';
  import { type PatientsResponse } from '$types/pocketbase';
  import { Skeleton } from '$components/ui/skeleton';
  import * as Popover from '$components/ui/popover';
  import * as Command from '$components/ui/command';
  import { Button } from '$components/ui/button';
  import * as Card from '$components/ui/card';
  import { cn } from '$lib/utils';
  import { getLocale } from '$lib/paraglide/runtime';

  interface Props {
    data: any[];
    onRowClick?: (row: any) => void;
    patients: Promise<PatientsResponse[]>;
  }

  let { data, onRowClick, patients }: Props = $props();

  let selectedPatients = $state<string[]>([]);
  let isOpen = $state(false);

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
    return selectedPatients.length === 0 || selectedPatients.includes(patientUuid);
  }
</script>

<div class="space-y-4">
  <div class="flex items-center gap-2">
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
              : 'Select patients...'}
            <ChevronsUpDown class="ms-2 size-4 shrink-0 opacity-50" />
          </Button>
        </Popover.Trigger>
        <Popover.Content class="w-[200px] p-0">
          <Command.Root>
            <Command.Input placeholder="Search patients..." />
            <Command.List>
              <Command.Empty>No patients found.</Command.Empty>
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
  </div>

  <!-- Reports Grid -->
  {#if data.length === 0}
    <div class="text-center py-12 text-muted-foreground">No results.</div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each data as item, idx (idx)}
        {#if isPatientVisible(item)}
          <Card.Root
            onclick={() => onRowClick?.(item)}
            class="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <Card.Header>
              <Card.Title class="mb-4">{getPatientName(item)}</Card.Title>
              <div class="space-y-3">
                {#if item.summary}
                  <div>
                    <div class="text-xs font-semibold text-muted-foreground uppercase">Summary</div>
                    <div class="text-sm font-medium line-clamp-4">
                      {item.summary}
                    </div>
                  </div>
                {/if}
                {#if item.created}
                  <div>
                    <div class="text-xs font-semibold text-muted-foreground uppercase">Created</div>
                    <div class="text-sm font-medium">
                      {new Date(item.created).toLocaleDateString(getLocale(), {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                {/if}
              </div>
            </Card.Header>
          </Card.Root>
        {/if}
      {/each}
    </div>
  {/if}
</div>
