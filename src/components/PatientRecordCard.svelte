<script lang="ts">
  import type { PatientRecordsRecord } from '$types/pocketbase';
  import * as Card from '$components/ui/card/index.js';
  let { patientRecord }: { patientRecord: PatientRecordsRecord } = $props();
</script>

<Card.Root class="cursor-pointer gap-2 transition-shadow">
  <Card.Header>
    <Card.Title class="flex flex-col">
      <span>{patientRecord.date}</span>
      <span>{patientRecord.type}</span>
    </Card.Title>
    <Card.Description>
      {patientRecord.summary}
    </Card.Description>
  </Card.Header>
  <Card.Content></Card.Content>
</Card.Root>
