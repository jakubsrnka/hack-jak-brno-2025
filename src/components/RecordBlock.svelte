<script lang="ts">
  import KeyPartsBlock from '$components/KeyPartsBlock.svelte';
  import PatientRecordCard from '$components/PatientRecordCard.svelte';
  import type { KeyPart } from '$types/openai';
  import type { PatientRecordsRecord, PatientRecordsResponse } from '$types/pocketbase';
  import { fetchRecordAIData, getPatientReport, setRecordAIData } from '$lib/services';
  import { onMount } from 'svelte';
  import { pbClient } from '$lib/pocketbase';
  import { Skeleton } from '$components/ui/skeleton';
  import { toast } from 'svelte-sonner';

  let {
    patientRecord,
    searchQuery = '',
    reportId
  }: {
    patientRecord: PatientRecordsRecord;
    searchQuery?: string;
    reportId: string;
  } = $props();

  let isOpen = $state(false);
  let hoveredCitations: string[] | null = $state(null);
  let isLoadingData = $state(true);
  let recordData = $state<PatientRecordsResponse>(patientRecord as PatientRecordsResponse);

  onMount(async () => {
    if (recordData.summary) {
      isLoadingData = false;
      return;
    }

    try {
      isLoadingData = true;

      const report = await getPatientReport(reportId)

      const keywords = ((report as unknown) as { keywords?: string[] })?.keywords ?? [];
      const aiData = await fetchRecordAIData(recordData.id, keywords);
      await setRecordAIData(recordData.id, aiData);

      recordData = {
        ...recordData,
        summary: aiData.summary,
        keyParts: aiData.keyParts
      };
    } catch (error) {
      console.error('Error fetching AI data for record:', error);
      toast.error((error as Error).message);
    } finally {
      isLoadingData = false
    }
  });
</script>

{#if isLoadingData}
  <div class="flex w-full flex-col md:flex-row gap-4">
    <div class="w-full md:w-[70%]">
      <div class="rounded-lg border bg-card p-6">
        <div class="flex items-center gap-2 mb-4">
          <div class="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <p class="text-sm text-muted-foreground">Získávám souhrnné informace...</p>
        </div>
        <Skeleton class="h-4 w-full mb-2" />
        <Skeleton class="h-4 w-3/4 mb-2" />
        <Skeleton class="h-4 w-5/6" />
      </div>
    </div>
  </div>
{:else}
  <div class="flex w-full flex-col md:flex-row gap-4">
    <div class="w-full md:w-[70%]">
      <PatientRecordCard
        bind:hoveredCitations
        patientRecord={recordData}
        {searchQuery}
        keyParts={recordData.keyParts as KeyPart[]}
        bind:isOpen
      />
    </div>
    {#if isOpen}
      <div class="w-full md:w-[27%] relative">
        <KeyPartsBlock keyParts={recordData.keyParts as KeyPart[]} bind:hoveredCitations />
      </div>
    {/if}
  </div>
{/if}
