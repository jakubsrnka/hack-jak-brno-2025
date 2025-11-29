<script lang="ts">
  import * as Sidebar from '$components/ui/sidebar/index.js';
  import { Users, House, ChevronUp } from 'lucide-svelte';
  import * as DropdownMenu from '$components/ui/dropdown-menu';
  import { currentUser, logout } from '$lib/pocketbase';
  import { Button } from '$components/ui/button';
  import { m } from '$lib/paraglide/messages';
  import { uploadDocumentDialogOpen } from '$lib/stores/dialog';

  const items = [
    {
      title: 'Domů',
      url: '/',
      icon: House
    },
    {
      title: 'Pacienti',
      url: '/patients',
      icon: Users
    }
  ];

  function openUploadDialog() {
    uploadDocumentDialogOpen.set(true);
  }
</script>

<Sidebar.Root>
  <Sidebar.Content>
    <Sidebar.Group class="h-full">
      <Sidebar.GroupLabel>Docuhelper</Sidebar.GroupLabel>
      <Sidebar.GroupContent class="h-full justify-between flex flex-col">
        <Sidebar.Menu>
          {#each items as item (item.title)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                {#snippet child({ props })}
                  <a href={item.url} {...props}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
        <Sidebar.Footer>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  {#snippet child({ props })}
                    <Sidebar.MenuButton
                      {...props}
                      class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      {$currentUser?.name}
                      <ChevronUp class="ms-auto" />
                    </Sidebar.MenuButton>
                  {/snippet}
                </DropdownMenu.Trigger>
                <DropdownMenu.Content side="top" class="w-(--bits-dropdown-menu-anchor-width)">
                  <DropdownMenu.Item onclick={openUploadDialog}>
                    <span>Nahrát dokumentaci</span>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item>
                    <Button variant="destructive" class="w-full text-left" onclick={logout}
                      >{m.sidepanel_logout()}</Button
                    >
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.Footer>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>
</Sidebar.Root>
