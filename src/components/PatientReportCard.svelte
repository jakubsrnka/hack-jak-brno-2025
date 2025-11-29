<script lang="ts">
  import type { PatientReportsResponse } from '$types/pocketbase';
  import * as Card from '$components/ui/card/index.js';
  import { page } from '$app/state';
  let { patientReport }: { patientReport: PatientReportsResponse } = $props();
  let currentPath = page.url.pathname;
</script>

<a href="{currentPath}/report/{patientReport.id}">
  <Card.Root class="cursor-pointer gap-2 transition-shadow">
    <Card.Header>
      <Card.Title class="flex flex-col gap-2">
        <span>Report</span>
        <span>{patientReport.created}</span>
      </Card.Title>
      <Card.Description>
        {@html patientReport.summary}
      </Card.Description>
    </Card.Header>
  </Card.Root>
</a>
