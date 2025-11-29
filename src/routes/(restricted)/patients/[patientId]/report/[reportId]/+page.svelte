<script lang="ts">
  import * as Select from '$components/ui/select/index.js';
  import type { PatientRecordsResponse } from '$types/pocketbase';
  import { page } from '$app/state';
  import RecordBlock from '$components/RecordBlock.svelte';
  import { onMount } from 'svelte';
  import { getPatientRecords } from '$lib/services';
  import Input from '$components/ui/input/input.svelte';
  import Label from '$components/ui/label/label.svelte';

  let reportId = page.params.reportId;
  let selectedRecordType = $state<string | null>(null);
  let searchQuery = $state<string>('');
  let patientRecords: PatientRecordsResponse[] = $state([]);

  const uniqueRecordTypes = $derived(
    [...new Set(patientRecords.map((record) => record.type))].sort()
  );

  const filteredRecords = $derived(
    patientRecords.filter((record) => {
      if (record.report !== reportId) return false;

      if (selectedRecordType && record.type !== selectedRecordType) return false;

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

  onMount(async () => {
    if (reportId) {
      patientRecords = await getPatientRecords(reportId);
    }
  });
</script>

<div class="flex gap-4 relative">
  <div class="flex flex-col gap-4 w-full h-full">
    <div class="flex flex-col md:flex-row gap-4 py-6 shrink-0 sticky z-10 top-0 bg-background">
      <div class="flex flex-col gap-2">
        <Label>Typ záznamu</Label>
        <Select.Root type="single">
          <Select.Trigger class="w-[180px]">
            {selectedRecordType ?? 'Typ záznamu'}
          </Select.Trigger>
          <Select.Content>
            {#each uniqueRecordTypes as type}
              <Select.Item value={type} onclick={() => (selectedRecordType = type)}>
                {type}
              </Select.Item>
            {/each}
            <Select.Item value="all" onclick={() => (selectedRecordType = null)}>
              Všechny typy
            </Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
      <div class="flex flex-col gap-2 w-full">
        <Label>Hledat v záznamech</Label>
        <Input bind:value={searchQuery} placeholder="Hledat..." class="flex-1 min-h-9" />
      </div>
    </div>
    <div class="flex flex-col gap-4 flex-1">
      {#each filteredRecords as record, index (record.id)}
        <RecordBlock patientRecord={record} {searchQuery} />
      {/each}
    </div>
  </div>
</div>
