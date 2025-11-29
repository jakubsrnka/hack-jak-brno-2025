<script lang="ts">
  import * as Sidebar from '$components/ui/sidebar';
  import { Users, House, ChevronUp, Upload, NotebookPen } from 'lucide-svelte';
  import * as DropdownMenu from '$components/ui/dropdown-menu';
  import { currentUser, logout } from '$lib/pocketbase';
  import { Button } from '$components/ui/button';
  import { m } from '$lib/paraglide/messages';
  import { uploadDocumentDialogOpen } from '$lib/stores/dialog';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';

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

  function isActive(url: string): boolean {
    return page.url.pathname === url;
  }

  const isOnReportPage = $derived(
    page.url.pathname.match(/^\/patients\/[^/]+\/report\/[^/]+$/) !== null
  );

  const isOnPatientPage = $derived(page.url.pathname.match(/^\/patients\/[^/]+$/) !== null);

  const shouldShowSubMenu = $derived(isOnReportPage || isOnPatientPage);

  const subMenuItems = $derived(() => {
    const pathParts = page.url.pathname.split('/').filter(Boolean);
    let backUrl = pathParts.length > 1 ? '/' + pathParts.slice(0, -1).join('/') : '/';

    // If going back one level would land on /report, go back two levels instead
    if (backUrl.endsWith('/report')) {
      backUrl = pathParts.length > 2 ? '/' + pathParts.slice(0, -2).join('/') : '/';
    }

    if (isOnReportPage) {
      return [
        { title: 'Zpět', url: backUrl },
        { title: 'Aktuální zpráva', url: page.url.pathname }
      ];
    } else if (isOnPatientPage) {
      return [
        { title: 'Zpět', url: backUrl },
        { title: 'Zprávy pacienta', url: page.url.pathname }
      ];
    }
    return [];
  });
</script>

<Sidebar.Root>
  <Sidebar.Content>
    <Sidebar.Group class="h-full">
      <Sidebar.GroupLabel onclick={() => goto('/')}
        ><NotebookPen class="mr-2" />
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
            </Sidebar.MenuItem>
          {/each}
          {#if shouldShowSubMenu}
            <Sidebar.MenuItem>
              <Sidebar.MenuSub>
                {#each subMenuItems() as subItem}
                  <Sidebar.MenuSubItem>
                    <Sidebar.MenuSubButton isActive={isActive(subItem.url)}>
                      {#snippet child({ props })}
                        <a href={subItem.url} {...props}>
                          {subItem.title}
                        </a>
                      {/snippet}
                    </Sidebar.MenuSubButton>
                  </Sidebar.MenuSubItem>
                {/each}
              </Sidebar.MenuSub>
            </Sidebar.MenuItem>
          {/if}
        </Sidebar.Menu>
        <Sidebar.Footer>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton onclick={openUploadDialog}>
                <div class="flex gap-1.5 items-center hover:cursor-pointer">
                  <Upload size={16} />Nahrát dokumentaci
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
