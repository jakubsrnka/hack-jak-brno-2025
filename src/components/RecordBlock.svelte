<script lang="ts">
  import KeyPartsBlock from '$components/KeyPartsBlock.svelte';
  import PatientRecordCard from '$components/PatientRecordCard.svelte';
  import type { PatientRecordsRecord } from '$types/pocketbase';

  let { patientRecord }: { patientRecord: PatientRecordsRecord } = $props();

  let isOpen = $state(false);
</script>

<div class="flex w-full gap-4">
  <div class="w-[70%]">
    <PatientRecordCard {patientRecord} bind:isOpen />
  </div>
  {#if isOpen}
    <div class="w-[30%]">
      <KeyPartsBlock keyParts={patientRecord.keyParts as string[]} />
    </div>
  {/if}
</div>
