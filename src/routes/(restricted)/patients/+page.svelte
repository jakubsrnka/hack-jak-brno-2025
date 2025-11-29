<script lang="ts">
  import { onMount } from 'svelte';
  import PatientCard from '$components/PatientCard.svelte';
  import { getPatientsByDoctor } from '$lib/services';
  import type { PatientsResponse } from '$types/pocketbase';
  import { currentUser } from '$lib/pocketbase';

  let patients: PatientsResponse[] = [];

  onMount(async () => {
    if ($currentUser) {
      patients = await getPatientsByDoctor([$currentUser.id]);
    }
  });
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
  {#each patients as patient (patient.id)}
    <PatientCard {patient} />
  {/each}
</div>
