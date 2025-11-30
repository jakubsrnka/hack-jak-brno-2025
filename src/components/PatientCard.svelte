<script lang="ts">
  import * as Card from '$components/ui/card/index.js';
  import type { PatientsResponse } from '$types/pocketbase';
  import { User } from 'lucide-svelte';
  let { patient }: { patient: PatientsResponse } = $props();
</script>

<a href="/patients/{patient.id}">
  <Card.Root class="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] h-[220px]">
    <Card.Header class="pb-2 pt-4">
      <Card.Title class="flex items-center justify-center">
        <div class="rounded-full bg-primary/10 p-4">
          <User class="size-8 text-primary" />
        </div>
      </Card.Title>
    </Card.Header>
    <Card.Content class="text-center">
      <div class="text-xs font-semibold text-muted-foreground uppercase mb-1">Patient ID</div>
      <div class="text-xl font-bold">{patient.uuid}</div>
    </Card.Content>
  </Card.Root>
</a>
