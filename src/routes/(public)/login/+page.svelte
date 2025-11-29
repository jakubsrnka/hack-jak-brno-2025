<script lang="ts">
  import Input from '$components/ui/input/input.svelte';
  import * as Card from '$components/ui/card';
  import { Button } from '$components/ui/button';
  import { Label } from '$components/ui/label';
  import { m } from '$lib/paraglide/messages';
  import { currentUser, defaultLogin, pbClient } from '$lib/pocketbase/';
  import { toast } from 'svelte-sonner';
  import { goto } from '$app/navigation';
  import { Collections } from '$types/pocketbase';
  import type { AuthRecord } from 'pocketbase';
  import Arrow from '$components/Arrow.svelte';

  const handleLogin = async (event: SubmitEvent) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const email = target.email.value;
    const password = target.password.value;

    try {
      const { record } = await pbClient
        .collection(Collections.Users)
        .authWithPassword(email, password);
      if (record) {
        currentUser.set(record as AuthRecord);
        toast.success(m.login_successfulLogin());
        goto('/');
      }
    } catch {
      toast.error(m.login_wrongCredentials());
    }
  };
</script>

<Arrow
  class="pointer-events-none absolute left-1/2 top-[calc(50%-200px)] z-30 -translate-x-1/2 -translate-y-1/2 transform sm:left-[calc(50%+20px)]"
/>
<div class="flex h-screen items-center justify-center">
  <Card.Root class="w-[90%] max-w-80">
    <Card.Header class="space-y-1">
      <Card.Title class="text-2xl">{m.login_loginVia()}</Card.Title>
      <Card.Description>{m.login_enterEmail()}</Card.Description>
    </Card.Header>
    <form class="flex flex-col gap-4" onsubmit={handleLogin}>
      <Card.Content class="grid gap-4">
        <div class="grid grid-cols-1 gap-6">
          <Button variant="outline" class="h-16" onclick={() => defaultLogin()}>
            <img src="/indentita-obcana-logo.png" alt="Indentita Obcana Logo" class="h-8 w-auto" />
            {m.login_citizenPortal()}
          </Button>
        </div>
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t"></span>
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-card px-2 text-muted-foreground">{m.login_orContinueWith()}</span>
          </div>
        </div>
        <div class="grid gap-2">
          <Label for="email">{m.login_email()}</Label>
          <Input id="email" name="email" type="email" placeholder={m.login_exampleEmail()} />
        </div>
        <div class="grid gap-2">
          <Label for="password">{m.login_password()}</Label>
          <Input id="password" name="password" type="password" />
        </div>
      </Card.Content>
      <Card.Footer>
        <Button class="w-full" type="submit">{m.login_createAccountButton()}</Button>
      </Card.Footer>
    </form>
  </Card.Root>
</div>
