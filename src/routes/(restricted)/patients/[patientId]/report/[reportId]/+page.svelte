<script lang="ts">
  import * as Select from '$components/ui/select/index.js';
  import type { PatientRecordsResponse } from '$types/pocketbase';
  import { page } from '$app/state';
  import RecordBlock from '$components/RecordBlock.svelte';
  import { onMount } from 'svelte';
  import { getPatientRecords } from '$lib/services';

  let reportId = page.params.reportId;
  let selectedRecordType = $state<string | null>(null);
  let patientRecords: PatientRecordsResponse[] = $state([]);

  const uniqueRecordTypes = $derived(
    [...new Set(patientRecords.map((record) => record.type))].sort()
  );

  onMount(async () => {
    if (reportId) {
      patientRecords = await getPatientRecords(reportId);
    }
  });
</script>

<div class="flex gap-4 h-[calc(100vh-4rem)] relative">
  <div class="flex flex-col gap-4 w-full h-full">
    <div class="flex gap-4 shrink-0">
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
    <div class="flex flex-col overflow-y-auto gap-4 flex-1 min-h-0">
      {#each patientRecords as record (record.id)}
        {#if record.report === reportId}
          {#if !selectedRecordType || record.type === selectedRecordType}
            <RecordBlock patientRecord={record} />
          {/if}
        {/if}
      {/each}
    </div>
  </div>
</div>
