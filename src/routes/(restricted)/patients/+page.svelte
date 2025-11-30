<script lang="ts">
  import { onMount } from 'svelte';
  import PatientCard from '$components/PatientCard.svelte';
  import { getPatientsByDoctor } from '$lib/services';
  import type { PatientsResponse } from '$types/pocketbase';
  import { currentUser } from '$lib/pocketbase';
  import { Skeleton } from '$components/ui/skeleton/index.js';
  import * as Card from '$components/ui/card/index.js';
  import { breadcrumbItems, subMenuStore } from '$lib/stores';
  import { m } from '$lib/paraglide/messages';

  let patients: PatientsResponse[] = $state([]);
  let loading = $state(true);

  onMount(async () => {
    if ($currentUser) {
      const startTime = Date.now();
      patients = await getPatientsByDoctor([$currentUser.id]);
      breadcrumbItems.set({
        ...$breadcrumbItems,
        items: {
          ...$breadcrumbItems?.items,
          patients: {
            name: $breadcrumbItems?.items?.patients?.name || 'patients',
            href: '/patients',
            items: {
              ...patients.reduce(
                (acc, patient) => {
                  acc[patient.id] = { name: patient.uuid, href: `/patients/${patient.id}` };
                  return acc;
                },
                {} as Record<string, { name: string; href: string }>
              )
            }
          }
        }
      });
      console.log($breadcrumbItems);
      subMenuStore.set(
        patients
          .map((patient) => ({
            title: patient.uuid,
            url: `/patients/${patient.id}`
          }))
          .sort((a, b) => a.title.localeCompare(b.title))
      );
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 300 - elapsed);
      await new Promise((resolve) => setTimeout(resolve, remaining));
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>{m.page_patients_title()} | docuhelper.site</title>
</svelte:head>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
  {#if loading}
    {#each Array(8) as _, i (i)}
      <Card.Root class="max-h-[106px] gap-2">
        <Card.Header class="gap-0">
          <Skeleton class="h-6 w-6 rounded-2xl" />
        </Card.Header>
        <Card.Content>
          <Skeleton class="h-6 w-full" />
        </Card.Content>
      </Card.Root>
    {/each}
  {:else}
    {#each patients as patient (patient.id)}
      <PatientCard {patient} />
    {/each}
  {/if}
</div>
