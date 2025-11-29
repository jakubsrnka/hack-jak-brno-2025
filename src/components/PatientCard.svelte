<script lang="ts">
  import * as Card from '$components/ui/card/index.js';
  import type { PatientsResponse } from '$types/pocketbase';
  import { User } from 'lucide-svelte';
  let { patient }: { patient: PatientsResponse } = $props();
</script>

<a href="/patients/{patient.id}">
  <Card.Root class="cursor-pointer gap-2 transition-shadow">
    <Card.Header>
      <Card.Title>
        <User class="inline-block me-2" />
      </Card.Title>
    </Card.Header>
    <Card.Content>
      <p>Pacient: {patient.id}</p>
    </Card.Content>
  </Card.Root>
</a>
