<script lang="ts">
  import ReportCard from '$components/ReportCard.svelte';
  import { getPatientReports } from '$lib/services';
  import type { PageData } from './$types';
  import { Skeleton } from '$components/ui/skeleton';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';

  let { data }: { data: PageData } = $props();
  let currentPath = page.url.pathname;
</script>

{#await getPatientReports(data.patientId)}
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
    {#each Array(3)}
      <Skeleton class="h-[140px] w-full rounded-lg" />
    {/each}
  </div>
{:then patientReports}
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
    {#each patientReports as report (report.id)}
      {#if !!report.summary}
        <ReportCard
          created={report.created}
          shortSummary={report.summary}
          onclick={() => goto(`${currentPath}/report/${report.id}`)}
        />
      {/if}
    {/each}
  </div>
{/await}
