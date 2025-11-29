<script lang="ts">
  import type { PatientRecordsRecord } from '$types/pocketbase';
  import * as Card from '$components/ui/card/index.js';
  import * as Accordion from '$components/ui/accordion/index.js';
  let { patientRecord }: { patientRecord: PatientRecordsRecord } = $props();

  let value = $state<string>();
</script>

<Accordion.Root type="single" bind:value class="cursor-pointer w-full">
  <Accordion.Item value="item-1">
    <Card.Root
      class="gap-2 transition-shadow"
      onclick={() => (value = value === 'item-1' ? undefined : 'item-1')}
    >
      <Card.Header>
        <Card.Title class="flex flex-col">
          <span>{patientRecord.date}</span>
          <span>{patientRecord.type}</span>
        </Card.Title>
        <Card.Description>
          {patientRecord.summary}
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <Accordion.Content class="p-0">{patientRecord.text}</Accordion.Content>
      </Card.Content>
    </Card.Root>
  </Accordion.Item>
</Accordion.Root>
