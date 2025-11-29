<script lang="ts">
  import * as Select from '$components/ui/select/index.js';
  import type { IsoAutoDateString, PatientRecordsRecord } from '$types/pocketbase';
  import { page } from '$app/state';
  import RecordBlock from '$components/RecordBlock.svelte';

  let reportId = page.params.reportId;
  let selectedRecordType = $state<string | null>(null);

  // Souhrn toho co si vybral aby mu chat vyplivnul
  const patientRecords: PatientRecordsRecord[] = [
    {
      id: '1',
      report: '1',
      date: new Date().toISOString(),
      keyParts: ['key1', 'key2', 'key1', 'key2'] as string[],
      type: 'type1',
      created: new Date().toISOString() as IsoAutoDateString,
      updated: new Date().toISOString() as IsoAutoDateString,
      summary: 'Summary text',
      text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sit amet tempor nisl, id accumsan elit. Vivamus dolor odio, scelerisque sit amet vestibulum eu, tempus in felis. Duis ac odio in nulla euismod scelerisque vitae ac mauris. Proin facilisis justo quis sollicitudin commodo. Integer non dui nulla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse convallis eget nulla quis condimentum. In hac habitasse platea dictumst. In non condimentum augue. Vestibulum tincidunt vitae neque non facilisis. Nulla tristique quis mauris eu eleifend.`
    },
    {
      id: '2',
      report: '2',
      date: new Date().toISOString(),
      keyParts: [] as string[],
      type: 'type2',
      created: new Date().toISOString() as IsoAutoDateString,
      updated: new Date().toISOString() as IsoAutoDateString,
      summary: 'Summary text',
      text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sit amet tempor nisl, id accumsan elit. Vivamus dolor odio, scelerisque sit amet vestibulum eu, tempus in felis. Duis ac odio in nulla euismod scelerisque vitae ac mauris. Proin facilisis justo quis sollicitudin commodo. Integer non dui nulla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse convallis eget nulla quis condimentum. In hac habitasse platea dictumst. In non condimentum augue. Vestibulum tincidunt vitae neque non facilisis. Nulla tristique quis mauris eu eleifend.`
    },
    {
      id: '3',
      report: '1',
      date: new Date().toISOString(),
      keyParts: [] as string[],
      type: 'type2',
      created: new Date().toISOString() as IsoAutoDateString,
      updated: new Date().toISOString() as IsoAutoDateString,
      summary: 'Summary text',
      text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sit amet tempor nisl, id accumsan elit. Vivamus dolor odio, scelerisque sit amet vestibulum eu, tempus in felis. Duis ac odio in nulla euismod scelerisque vitae ac mauris. Proin facilisis justo quis sollicitudin commodo. Integer non dui nulla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse convallis eget nulla quis condimentum. In hac habitasse platea dictumst. In non condimentum augue. Vestibulum tincidunt vitae neque non facilisis. Nulla tristique quis mauris eu eleifend.`
    },
    {
      id: '4',
      report: '1',
      date: new Date().toISOString(),
      keyParts: [] as string[],
      type: 'type2',
      created: new Date().toISOString() as IsoAutoDateString,
      updated: new Date().toISOString() as IsoAutoDateString,
      summary: 'Summary text',
      text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sit amet tempor nisl, id accumsan elit. Vivamus dolor odio, scelerisque sit amet vestibulum eu, tempus in felis. Duis ac odio in nulla euismod scelerisque vitae ac mauris. Proin facilisis justo quis sollicitudin commodo. Integer non dui nulla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse convallis eget nulla quis condimentum. In hac habitasse platea dictumst. In non condimentum augue. Vestibulum tincidunt vitae neque non facilisis. Nulla tristique quis mauris eu eleifend.`
    },
    {
      id: '5',
      report: '1',
      date: new Date().toISOString(),
      keyParts: [] as string[],
      type: 'type2',
      created: new Date().toISOString() as IsoAutoDateString,
      updated: new Date().toISOString() as IsoAutoDateString,
      summary: 'Summary text',
      text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sit amet tempor nisl, id accumsan elit. Vivamus dolor odio, scelerisque sit amet vestibulum eu, tempus in felis. Duis ac odio in nulla euismod scelerisque vitae ac mauris. Proin facilisis justo quis sollicitudin commodo. Integer non dui nulla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse convallis eget nulla quis condimentum. In hac habitasse platea dictumst. In non condimentum augue. Vestibulum tincidunt vitae neque non facilisis. Nulla tristique quis mauris eu eleifend.`
    },
    {
      id: '6',
      report: '1',
      date: new Date().toISOString(),
      keyParts: [] as string[],
      type: 'type2',
      created: new Date().toISOString() as IsoAutoDateString,
      updated: new Date().toISOString() as IsoAutoDateString,
      summary: 'Summary text',
      text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sit amet tempor nisl, id accumsan elit. Vivamus dolor odio, scelerisque sit amet vestibulum eu, tempus in felis. Duis ac odio in nulla euismod scelerisque vitae ac mauris. Proin facilisis justo quis sollicitudin commodo. Integer non dui nulla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse convallis eget nulla quis condimentum. In hac habitasse platea dictumst. In non condimentum augue. Vestibulum tincidunt vitae neque non facilisis. Nulla tristique quis mauris eu eleifend.`
    },
    {
      id: '7',
      report: '1',
      date: new Date().toISOString(),
      keyParts: [] as string[],
      type: 'type2',
      created: new Date().toISOString() as IsoAutoDateString,
      updated: new Date().toISOString() as IsoAutoDateString,
      summary: 'Summary text',
      text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sit amet tempor nisl, id accumsan elit. Vivamus dolor odio, scelerisque sit amet vestibulum eu, tempus in felis. Duis ac odio in nulla euismod scelerisque vitae ac mauris. Proin facilisis justo quis sollicitudin commodo. Integer non dui nulla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse convallis eget nulla quis condimentum. In hac habitasse platea dictumst. In non condimentum augue. Vestibulum tincidunt vitae neque non facilisis. Nulla tristique quis mauris eu eleifend.`
    },
    {
      id: '8',
      report: '1',
      date: new Date().toISOString(),
      keyParts: [] as string[],
      type: 'type2',
      created: new Date().toISOString() as IsoAutoDateString,
      updated: new Date().toISOString() as IsoAutoDateString,
      summary: 'Summary text',
      text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sit amet tempor nisl, id accumsan elit. Vivamus dolor odio, scelerisque sit amet vestibulum eu, tempus in felis. Duis ac odio in nulla euismod scelerisque vitae ac mauris. Proin facilisis justo quis sollicitudin commodo. Integer non dui nulla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse convallis eget nulla quis condimentum. In hac habitasse platea dictumst. In non condimentum augue. Vestibulum tincidunt vitae neque non facilisis. Nulla tristique quis mauris eu eleifend.`
    },
    {
      id: '9',
      report: '1',
      date: new Date().toISOString(),
      keyParts: [] as string[],
      type: 'type2',
      created: new Date().toISOString() as IsoAutoDateString,
      updated: new Date().toISOString() as IsoAutoDateString,
      summary: 'Summary text',
      text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sit amet tempor nisl, id accumsan elit. Vivamus dolor odio, scelerisque sit amet vestibulum eu, tempus in felis. Duis ac odio in nulla euismod scelerisque vitae ac mauris. Proin facilisis justo quis sollicitudin commodo. Integer non dui nulla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse convallis eget nulla quis condimentum. In hac habitasse platea dictumst. In non condimentum augue. Vestibulum tincidunt vitae neque non facilisis. Nulla tristique quis mauris eu eleifend.`
    }
  ];

  const uniqueRecordTypes = $derived(
    [...new Set(patientRecords.map((record) => record.type))].sort()
  );
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
