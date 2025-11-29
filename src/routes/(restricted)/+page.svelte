<script lang="ts">
  import ReportsTable from '$components/ReportsTable.svelte';
  import { Skeleton } from '$components/ui/skeleton';
  import { pbClient } from '$lib/pocketbase';
  import {
    Collections,
    type PatientReportsResponse,
    type PatientsResponse
  } from '$types/pocketbase';
  import { goto } from '$app/navigation';

  type PatientReportWithPatient = PatientReportsResponse<{
    patient: PatientsResponse;
  }>;

  const data: Promise<PatientReportWithPatient[]> = pbClient
    .collection(Collections.PatientReports)
    .getFullList<PatientReportWithPatient>({ expand: 'patient' });

  const patients: Promise<PatientsResponse[]> = pbClient
    .collection(Collections.Patients)
    .getFullList<PatientsResponse>();

  const handleRowClick = (row: PatientReportWithPatient) => {
    const patientId = row.expand.patient.id;
    const reportId = row.id;
    goto(`/patients/${patientId}/report/${reportId}`);
  };
</script>

{#await data}
  <div class="border rounded-md">
    <table class="w-full">
      <thead>
        <tr class="border-b">
          {#each Array(4) as _}
            <th class="h-12 px-4 text-left align-middle font-medium">
              <Skeleton class="h-4 w-20" />
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each Array(4) as _}
          <tr class="border-b">
            {#each Array(4) as _}
              <td class="p-4 align-middle">
                <Skeleton class="h-4 w-32" />
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{:then loadedData}
  <ReportsTable data={loadedData} onRowClick={handleRowClick} {patients} />
{/await}
