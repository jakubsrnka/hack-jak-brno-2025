<script lang="ts">
  import type { PatientRecordsResponse, PatientReportsResponse } from '$types/pocketbase';
  import { page } from '$app/state';
  import RecordBlock from '$components/RecordBlock.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { getPatientRecords, getPatientReport } from '$lib/services';
  import Input from '$components/ui/input/input.svelte';
  import { Button } from '$components/ui/button';
  import { goto } from '$app/navigation';
  import ClockIcon from 'lucide-svelte/icons/clock';
  import { browser } from '$app/environment';
  import BigSummary from '$components/BigSummary.svelte';
  import { pbClient } from '$lib/pocketbase';
  import { Collections } from '$types/pocketbase';
  import CheckIcon from '@lucide/svelte/icons/check';
  import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
  import * as Command from '$components/ui/command/index.js';
  import * as Popover from '$components/ui/popover/index.js';
  import { cn } from '$lib/utils.js';
  import type { KeyPart } from '$types/openai';
  import Label from '$components/ui/label/label.svelte';

  let reportId = page.params.reportId;
  let selectedRecordTypes = $state<string[]>([]);
  let selectedKeyPartTypes = $state<string[]>([]);
  let searchQuery = $state<string>('');
  let patientRecords: PatientRecordsResponse[] = $state([]);
  let patientReport: PatientReportsResponse | null = $state(null);

  const uniqueRecordTypes = $derived(
    [...new Set(patientRecords.map((record) => record.type))].sort()
  );

  const uniqueKeyPartTypes = $derived(
    [
      ...new Set(
        patientRecords
          .flatMap((record) => (record.keyParts as KeyPart[]) || [])
          .flatMap((part) => part.types || [])
      )
    ].sort()
  );

  const recordTypeOptions = $derived(
    uniqueRecordTypes.map((type) => ({
      value: type,
      label: type
    }))
  );

  const keyPartTypeOptions = $derived(
    uniqueKeyPartTypes.map((type) => ({
      value: type,
      label: type
    }))
  );

  let open = $state(false);
  let keyPartOpen = $state(false);
  let triggerRef = $state<HTMLButtonElement>(null!);
  let keyPartTriggerRef = $state<HTMLButtonElement>(null!);

  const selectedValue = $derived(
    selectedRecordTypes.length === 0
      ? 'Typy záznamů...'
      : selectedRecordTypes.length === 1
        ? selectedRecordTypes[0]
        : `${selectedRecordTypes.length} typů`
  );

  const selectedKeyPartValue = $derived(
    selectedKeyPartTypes.length === 0
      ? 'Klíčové informace...'
      : selectedKeyPartTypes.length === 1
        ? selectedKeyPartTypes[0]
        : `${selectedKeyPartTypes.length} typů`
  );

  const filteredRecords = $derived(
    patientRecords.filter((record) => {
      if (record.report !== reportId) return false;

      if (selectedRecordTypes.length > 0 && !selectedRecordTypes.includes(record.type))
        return false;

      if (selectedKeyPartTypes.length > 0) {
        const recordKeyPartTypes =
          (record.keyParts as KeyPart[])?.flatMap((part) => part.types || []) || [];
        const hasMatchingKeyPartType = selectedKeyPartTypes.some((type) =>
          recordKeyPartTypes.includes(type)
        );
        if (!hasMatchingKeyPartType) return false;
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesText = record.text?.toLowerCase().includes(query);
        const matchesSummary = record.summary?.toLowerCase().includes(query);
        const matchesType = record.type?.toLowerCase().includes(query);
        return matchesText || matchesSummary || matchesType;
      }

      return true;
    })
  );

  function toggleRecordType(type: string) {
    if (selectedRecordTypes.includes(type)) {
      selectedRecordTypes = selectedRecordTypes.filter((t) => t !== type);
    } else {
      selectedRecordTypes = [...selectedRecordTypes, type];
    }
  }

  function toggleKeyPartType(type: string) {
    if (selectedKeyPartTypes.includes(type)) {
      selectedKeyPartTypes = selectedKeyPartTypes.filter((t) => t !== type);
    } else {
      selectedKeyPartTypes = [...selectedKeyPartTypes, type];
    }
  }

  onMount(async () => {
    if (reportId) {
      patientRecords = await getPatientRecords(reportId);
      patientReport = await getPatientReport(reportId);

      // Subscribe to real-time updates for this report
      pbClient.collection(Collections.PatientReports).subscribe(reportId, (e) => {
        console.log('Report updated:', e);
        patientReport = e.record as PatientReportsResponse;
      });

      if (browser && window.location.hash) {
        const recordId = window.location.hash.substring(1);
        setTimeout(() => {
          const element = document.getElementById(recordId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  });

  onDestroy(() => {
    // Unsubscribe from real-time updates when component is destroyed
    if (reportId) {
      pbClient.collection(Collections.PatientReports).unsubscribe(reportId);
    }
  });
</script>

<div class="flex gap-4 relative">
  <div class="flex flex-col gap-4 w-full h-full">
    <div class="flex flex-col md:flex-row gap-4 py-6 shrink-0 sticky z-10 top-0 bg-background">
      <div class="flex flex-col gap-2">
        <Popover.Root bind:open>
          <Popover.Trigger bind:ref={triggerRef}>
            {#snippet child({ props })}
              <Button
                variant="outline"
                class="w-[200px] justify-between"
                {...props}
                role="combobox"
                aria-expanded={open}
              >
                {selectedValue}
                <ChevronsUpDownIcon class="ms-2 size-4 shrink-0 opacity-50" />
              </Button>
            {/snippet}
          </Popover.Trigger>
          <Popover.Content class="w-[200px] p-0">
            <Command.Root>
              <Command.Input placeholder="Typy záznamů..." />
              <Command.List>
                <Command.Empty>Typ nenalezen</Command.Empty>
                <Command.Group>
                  {#each recordTypeOptions as recordType, idx (idx)}
                    <Command.Item
                      value={recordType.value}
                      onSelect={() => {
                        toggleRecordType(recordType.value);
                      }}
                    >
                      <CheckIcon
                        class={cn(
                          'me-2 size-4',
                          !selectedRecordTypes.includes(recordType.value) && 'text-transparent'
                        )}
                      />
                      {recordType.label}
                    </Command.Item>
                  {/each}
                </Command.Group>
              </Command.List>
            </Command.Root>
          </Popover.Content>
        </Popover.Root>
      </div>
      <div class="flex flex-col gap-2">
        <Popover.Root bind:open={keyPartOpen}>
          <Popover.Trigger bind:ref={keyPartTriggerRef}>
            {#snippet child({ props })}
              <Button
                variant="outline"
                class="w-[200px] justify-between"
                {...props}
                role="combobox"
                aria-expanded={keyPartOpen}
              >
                {selectedKeyPartValue}
                <ChevronsUpDownIcon class="ms-2 size-4 shrink-0 opacity-50" />
              </Button>
            {/snippet}
          </Popover.Trigger>
          <Popover.Content class="w-[200px] p-0">
            <Command.Root>
              <Command.Input placeholder="Klíčové informace..." />
              <Command.List>
                <Command.Empty>Typ nenalezen</Command.Empty>
                <Command.Group>
                  {#each keyPartTypeOptions as keyPartType, idx (idx)}
                    <Command.Item
                      value={keyPartType.value}
                      onSelect={() => {
                        toggleKeyPartType(keyPartType.value);
                      }}
                    >
                      <CheckIcon
                        class={cn(
                          'me-2 size-4',
                          !selectedKeyPartTypes.includes(keyPartType.value) && 'text-transparent'
                        )}
                      />
                      {keyPartType.label}
                    </Command.Item>
                  {/each}
                </Command.Group>
              </Command.List>
            </Command.Root>
          </Popover.Content>
        </Popover.Root>
      </div>
      <div class="flex flex-col gap-2 w-full">
        <Input bind:value={searchQuery} placeholder="Hledat..." class="flex-1 min-h-9" />
      </div>
      <div class="flex flex-col gap-2 justify-end">
        <Button
          variant="outline"
          onclick={() => goto(`/patients/${page.params.patientId}/report/${reportId}/timeline`)}
          class="whitespace-nowrap"
        >
          <ClockIcon class="h-4 w-4 mr-2" />
          Časová osa
        </Button>
      </div>
    </div>
    {#if !searchQuery && selectedRecordTypes.length === 0 && selectedKeyPartTypes.length === 0}
      <BigSummary text={patientReport?.summary ?? ''} />
    {/if}
    <div class="flex flex-col gap-4 flex-1">
      {#if reportId}
        {#each filteredRecords as record (record.id)}
          <div id={record.id}>
            <RecordBlock patientRecord={record} {searchQuery} {reportId} />
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>
