<script lang="ts">
  import PatientReportCard from '$components/PatientReportCard.svelte';
  import { getPatientReports } from '$lib/services';
  import type { PageData } from './$types';
  import { Skeleton } from '$components/ui/skeleton';

  let { data }: { data: PageData } = $props();
</script>

{#await getPatientReports(data.patientId)}
  <Skeleton class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" />
{:then patientReports}
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
    {#each patientReports as report (report.id)}
      <PatientReportCard patientReport={report} />
    {/each}
  </div>
{/await}
