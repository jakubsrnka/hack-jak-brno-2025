<script lang="ts">
  import PatientRecordCard from '$components/PatientRecordCard.svelte';
  import * as Select from '$components/ui/select/index.js';
  import type { IsoAutoDateString, PatientRecordsRecord } from '$types/pocketbase';

  let selectedRecordType = $state<string | null>(null);

  // Souhrn toho co si vybral aby mu chat vyplivnul
  const patientRecords: PatientRecordsRecord[] = [
    {
      id: '1',
      date: new Date().toISOString(),
      keyParts: [],
      type: 'type1',
      created: new Date().toISOString() as IsoAutoDateString,
      updated: new Date().toISOString() as IsoAutoDateString,
      summary: 'Summary text',
      text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sit amet tempor nisl, id accumsan elit. Vivamus dolor odio, scelerisque sit amet vestibulum eu, tempus in felis. Duis ac odio in nulla euismod scelerisque vitae ac mauris. Proin facilisis justo quis sollicitudin commodo. Integer non dui nulla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse convallis eget nulla quis condimentum. In hac habitasse platea dictumst. In non condimentum augue. Vestibulum tincidunt vitae neque non facilisis. Nulla tristique quis mauris eu eleifend.`
    },
    {
      id: '2',
      date: new Date().toISOString(),
      keyParts: [],
      type: 'type2',
      created: new Date().toISOString() as IsoAutoDateString,
      updated: new Date().toISOString() as IsoAutoDateString,
      summary: 'Summary text',
      text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sit amet tempor nisl, id accumsan elit. Vivamus dolor odio, scelerisque sit amet vestibulum eu, tempus in felis. Duis ac odio in nulla euismod scelerisque vitae ac mauris. Proin facilisis justo quis sollicitudin commodo. Integer non dui nulla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse convallis eget nulla quis condimentum. In hac habitasse platea dictumst. In non condimentum augue. Vestibulum tincidunt vitae neque non facilisis. Nulla tristique quis mauris eu eleifend.`
    }
  ];
</script>

<div class="flex flex-col gap-4">
  <Select.Root type="single">
    <Select.Trigger class="w-[180px]">
      {selectedRecordType ?? 'Typ záznamu'}
    </Select.Trigger>
    <Select.Content>
      {#each patientRecords as record (record.id)}
        <Select.Item value={record.type} onclick={() => (selectedRecordType = record.type)}>
          {record.type}
        </Select.Item>
      {/each}
      <Select.Item value="all" onclick={() => (selectedRecordType = null)}>
        Všechny typy
      </Select.Item>
    </Select.Content>
  </Select.Root>
  {#each patientRecords as record (record.id)}
    {#if selectedRecordType === null || selectedRecordType === record.type}
      <PatientRecordCard patientRecord={record} />
    {/if}
  {/each}
</div>
