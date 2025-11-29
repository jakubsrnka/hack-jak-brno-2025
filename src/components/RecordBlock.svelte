<script lang="ts">
  import KeyPartsBlock from '$components/KeyPartsBlock.svelte';
  import PatientRecordCard from '$components/PatientRecordCard.svelte';
  import type { KeyPart } from '$types/openai';
  import type { PatientRecordsRecord } from '$types/pocketbase';

  let {
    patientRecord,
    searchQuery = ''
  }: {
    patientRecord: PatientRecordsRecord;
    searchQuery?: string;
  } = $props();

  let isOpen = $state(false);
  let hoveredCitations: string[] | null = $state(null);
</script>

<div class="flex w-full flex-col md:flex-row gap-4">
  <div class="w-full md:w-[70%]">
    <PatientRecordCard
      bind:hoveredCitations
      {patientRecord}
      {searchQuery}
      keyParts={patientRecord.keyParts as KeyPart[]}
      bind:isOpen
    />
  </div>
  {#if isOpen}
    <div class="w-full md:w-[27%] relative">
      <KeyPartsBlock keyParts={patientRecord.keyParts as KeyPart[]} bind:hoveredCitations />
    </div>
  {/if}
</div>
