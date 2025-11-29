<script lang="ts">
  import ReportsTable from '$components/ReportsTable.svelte';
  import { Skeleton } from '$components/ui/skeleton';
  import { Button } from '$components/ui/button';
  import { pbClient } from '$lib/pocketbase';
  import {
    Collections,
    type PatientReportsResponse,
    type PatientsResponse
  } from '$types/pocketbase';
  import { goto } from '$app/navigation';
  import { uploadDocumentDialogOpen } from '$lib/stores/dialog';
  import UploadIcon from 'lucide-svelte/icons/upload';
  import FileTextIcon from 'lucide-svelte/icons/file-text';

  type PatientReportWithPatient = PatientReportsResponse<{
    patient: PatientsResponse;
  }>;

  const data: Promise<PatientReportWithPatient[]> = pbClient
    .collection(Collections.PatientReports)
    .getFullList<PatientReportWithPatient>({ expand: 'patient', sort: '-created' });

  const patients: Promise<PatientsResponse[]> = pbClient
    .collection(Collections.Patients)
    .getFullList<PatientsResponse>();

  const handleRowClick = (row: PatientReportWithPatient) => {
    const patientId = row.expand.patient.id;
    const reportId = row.id;
    goto(`/patients/${patientId}/report/${reportId}`);
  };

  function openUploadDialog() {
    uploadDocumentDialogOpen.set(true);
  }
</script>

<!-- Upload section -->
<div
  class="mb-6 flex items-center gap-4 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20"
>
  <div class="p-3 bg-primary/10 rounded-full">
    <FileTextIcon class="h-6 w-6 text-primary" />
  </div>
  <h2 class="text-xl font-semibold flex-1">Nahrát zdravotní dokumentaci</h2>
  <Button size="lg" onclick={openUploadDialog}>
    <UploadIcon class="h-4 w-4 mr-2" />
    Nahrát dokumentaci
  </Button>
</div>

{#await data}
  <div class="border rounded-md">
    <table class="w-full">
      <thead>
        <tr class="border-b">
          {#each Array(4) as _, i (i)}
            <th class="h-12 px-4 text-left align-middle font-medium">
              <Skeleton class="h-4 w-20" />
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each Array(4) as _, i (i)}
          <tr class="border-b">
            {#each Array(4) as _, j (j)}
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
