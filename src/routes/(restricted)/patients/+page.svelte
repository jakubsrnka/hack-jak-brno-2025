<script lang="ts">
  import PatientCard from '$components/PatientCard.svelte';
  import type { IsoAutoDateString, PatientsRecord } from '$types/pocketbase';
  const patients: PatientsRecord[] = [
    {
      id: '1',
      doctor: ['honza'],
      created: new Date().toISOString() as IsoAutoDateString,
      updated: new Date().toISOString() as IsoAutoDateString
    },
    {
      id: '2',
      doctor: ['honza'],
      created: new Date().toISOString() as IsoAutoDateString,
      updated: new Date().toISOString() as IsoAutoDateString
    }
  ];
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
  {#each patients as patient (patient.id)}
    <PatientCard {patient} />
  {/each}
</div>
