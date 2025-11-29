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
  let hoveredCitation: string | null = $state(null);
</script>

<div class="flex w-full flex-col md:flex-row gap-4">
  <div class="w-full md:w-[70%]">
    <PatientRecordCard bind:hoveredCitation {patientRecord} {searchQuery} bind:isOpen />
  </div>
  {#if isOpen}
    <div class="w-full md:w-[30%]">
      <KeyPartsBlock keyParts={patientRecord.keyParts as KeyPart[]} bind:hoveredCitation />
    </div>
  {/if}
</div>
