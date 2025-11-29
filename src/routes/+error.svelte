<script lang="ts">
  import { Button } from '$components/ui/button';
  import * as Card from '$components/ui/card';
  import { m } from '$lib/paraglide/messages';
  import { page } from '$app/state';

  const navigateBack = () => {
    history.back();
  };
</script>

<div class="flex h-screen items-center justify-center">
  <Card.Root class="w-[90%] max-w-80">
    <Card.Header class="space-y-1">
      <Card.Title class="text-2xl">{m.error_error()} {page.status}</Card.Title>
    </Card.Header>
    {#if page.error?.message}
      <Card.Content class="grid gap-4">
        <Card.Description class="text-sm text-gray-500">
          {page.error.message}
        </Card.Description>
      </Card.Content>
    {/if}
    <Card.Footer>
      <Button class="w-full" onclick={navigateBack}>{m.error_back()}</Button>
    </Card.Footer>
  </Card.Root>
</div>
