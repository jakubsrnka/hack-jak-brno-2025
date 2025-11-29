<script lang="ts">
  import { page } from '$app/state';
  import PatientReportCard from '$components/PatientReportCard.svelte';
  import type { IsoAutoDateString, PatientReportsRecord } from '$types/pocketbase';

  let patientId = page.params.patientId;

  const patientReports: PatientReportsRecord[] = [
    {
      id: '1',
      patient: '1',
      record: ['1'],
      report: [],
      created: new Date().toISOString() as IsoAutoDateString,
      updated: new Date().toISOString() as IsoAutoDateString
    },
    {
      id: '2',
      patient: '2',
      record: ['2'],
      report: [],
      created: new Date().toISOString() as IsoAutoDateString,
      updated: new Date().toISOString() as IsoAutoDateString
    }
  ];
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
