<script lang="ts">
  import ReportsTable from '$components/ReportsTable.svelte';
  import { Skeleton } from '$components/ui/skeleton';
  import { pbClient } from '$lib/pocketbase';
  import {
    Collections,
    type PatientReportsResponse,
    type PatientsResponse
  } from '$types/pocketbase';
  import type { ColumnDef } from '@tanstack/table-core';
  import { createRawSnippet } from 'svelte';
  import { renderSnippet } from '$components/ui/data-table';
  import { goto } from '$app/navigation';
  import { getLocale } from '$lib/paraglide/runtime';

  type PatientReportWithPatient = PatientReportsResponse<{
    patient: PatientsResponse;
  }>;

  const data: Promise<PatientReportWithPatient[]> = pbClient
    .collection(Collections.PatientReports)
    .getFullList<PatientReportWithPatient>({ expand: 'patient' });

  const handleRowClick = (row: PatientReportWithPatient) => {
    const patientId = row.expand.patient.id;
    const reportId = row.id;
    goto(`/patients/${patientId}/report/${reportId}`);
  };

  export const columns: ColumnDef<PatientReportWithPatient>[] = [
    {
      accessorKey: 'expand.patient.uuid',
      header: 'Patient',
      enableSorting: true,
      size: 120
    },
    { accessorKey: 'summary', header: 'Summary', enableSorting: false, size: 400 },
    {
      accessorKey: 'created',
      header: 'Created At',
      enableSorting: true,
      size: 120,
      cell: ({ row }) => {
        const dateSnippet = createRawSnippet<[{ date: string }]>((getDate) => {
          const { date } = getDate();
          const formatted = new Date(date).toLocaleDateString(getLocale(), {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
          return {
            render: () => `<div>${formatted}</div>`
          };
        });
        return renderSnippet(dateSnippet, { date: row.original.created });
      }
    }
  ];
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
  <ReportsTable data={loadedData} {columns} onRowClick={handleRowClick} />
{/await}
