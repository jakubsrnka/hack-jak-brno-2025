<script lang="ts">
  import { page } from '$app/state';
  import PatientReportCard from '$components/PatientReportCard.svelte';
  import { getPatientReports } from '$lib/services';
  import type { PatientReportsResponse } from '$types/pocketbase';
  import { onMount } from 'svelte';

  let patientId = page.params.patientId;
  let patientReports: PatientReportsResponse[] = $state([]);

  onMount(async () => {
    if (patientId) {
      patientReports = await getPatientReports(patientId);
    }
  });
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
  {#if patientId}
    {#each patientReports as report (report.id)}
      {#if report.patient === patientId}
        <PatientReportCard patientReport={report} />
      {/if}
    {/each}
  {/if}
</div>
