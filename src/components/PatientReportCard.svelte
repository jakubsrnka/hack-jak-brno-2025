<script lang="ts">
  import type { PatientReportsRecord } from '$types/pocketbase';
  import * as Card from '$components/ui/card/index.js';
  import { page } from '$app/state';
  let { patientReport }: { patientReport: PatientReportsRecord } = $props();
  let currentPath = page.url.pathname;
</script>

<a href="{currentPath}/report/{patientReport.id}">
  <Card.Root class="cursor-pointer gap-2 transition-shadow">
    <Card.Header>
      <Card.Title>Report 1 for Patient {patientReport.patient}</Card.Title>
    </Card.Header>
    <Card.Content></Card.Content>
  </Card.Root>
</a>
