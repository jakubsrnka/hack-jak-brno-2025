<script lang="ts">
  import * as Sidebar from '$components/ui/sidebar';
  import { Users, House, ChevronUp, Upload, NotebookPen, Settings } from 'lucide-svelte';
  import * as DropdownMenu from '$components/ui/dropdown-menu';
  import { currentUser, logout } from '$lib/pocketbase';
  import { Button } from '$components/ui/button';
  import { m } from '$lib/paraglide/messages';
  import { uploadDocumentDialogOpen } from '$lib/stores/dialog';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import CurrentUrlQRCode from '$components/CurrentUrlQRCode.svelte';
  import { subMenuStore } from '$lib/stores';

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
    },
    {
      title: 'Nastavení',
      url: '/settings',
      icon: Settings
    }
  ];

  function openUploadDialog() {
    uploadDocumentDialogOpen.set(true);
  }

  function isActive(url: string): boolean {
    return page.url.pathname === url;
  }

  const WITH_SUBMENU_PAGES = ['/patients'];

  const hasSubMenu = (path: string): boolean => {
    return WITH_SUBMENU_PAGES.some((p) => path.startsWith(p));
  };

  $effect(() => {
    // Clear submenu if not on a page (or subpage) that requires it
    if (!hasSubMenu(page.url.pathname)) {
      subMenuStore.set([]);
    }
  });
</script>

<Sidebar.Root>
  <Sidebar.Content>
    <Sidebar.Group class="h-full">
      <Sidebar.GroupLabel onclick={() => goto('/')}>
        <NotebookPen class="mr-2" />
        <span class="font-bold">Docuhelper</span></Sidebar.GroupLabel
      >
      <Sidebar.Separator class="mb-2" />
      <Sidebar.GroupContent class="h-full justify-between flex flex-col">
        <Sidebar.Menu>
          {#each items as item (item.title)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton isActive={isActive(item.url)}>
                {#snippet child({ props })}
                  <a href={item.url} {...props}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
              {#if hasSubMenu(item.url) && $subMenuStore.length > 0}
                <Sidebar.MenuSub>
                  {#each $subMenuStore as subItem, idx (idx)}
                    <Sidebar.MenuSubItem>
                      <Sidebar.MenuSubButton isActive={isActive(subItem.url)} href={subItem.url}>
                        {subItem.title}
                      </Sidebar.MenuSubButton>
                    </Sidebar.MenuSubItem>
                  {/each}
                </Sidebar.MenuSub>
              {/if}
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
        <Sidebar.Footer>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <CurrentUrlQRCode />
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton onclick={openUploadDialog}>
                <div class="flex gap-1.5 items-center hover:cursor-pointer">
                  <Upload size={16} />
                  Nahrát dokumentaci
                </div>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  {#snippet child({ props })}
                    <Sidebar.MenuButton
                      {...props}
                      class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:cursor-pointer"
                    >
                      <!-- TODO add profile picture -->
                      {$currentUser?.name}
                      <ChevronUp class="ms-auto" />
                    </Sidebar.MenuButton>
                  {/snippet}
                </DropdownMenu.Trigger>
                <DropdownMenu.Content side="top" class="w-(--bits-dropdown-menu-anchor-width)">
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
