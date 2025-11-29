<script lang="ts">
  import { currentUser } from '$lib/pocketbase';
  import { updateUserSettings } from '$lib/services';
  import { Button } from '$components/ui/button';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$components/ui/card';
  import { Checkbox } from '$components/ui/checkbox';
  import { Label } from '$components/ui/label';
  import { Input } from '$components/ui/input';
  import { toast } from 'svelte-sonner';
  import { setDarkMode } from '$lib/stores/theme';
  import { defaultSearchKeys, type SearchKey } from '$lib/constants/settingsDefaults';
  import XIcon from 'lucide-svelte/icons/x';
  import PlusIcon from 'lucide-svelte/icons/plus';

  // Define settings interface
  interface UserSettings {
    darkMode: boolean;
    searchKeys: SearchKey[];

    [key: string]: unknown;
  }

  function getDefaultSettings(): UserSettings {
    const userSettings = $currentUser?.settings as UserSettings | null;
    return {
      darkMode: userSettings?.darkMode ?? false,
      searchKeys: userSettings?.searchKeys ?? [...defaultSearchKeys]
    };
  }

  // Initialize settings from current user or use defaults
  let settings: UserSettings = $state(getDefaultSettings());

  let isSaving = $state(false);

  async function handleSave() {
    isSaving = true;
    try {
      await updateUserSettings(settings);
      setDarkMode(settings.darkMode);
      toast.success('Nastavení úspěšně uloženo');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Nepodařilo se uložit nastavení');
    } finally {
      isSaving = false;
    }
  }

  function handleReset() {
    settings = getDefaultSettings();
    setDarkMode(settings.darkMode);
    toast.info('Nastavení obnoveno na uložené hodnoty');
  }

  function handleDarkModeChange() {
    setDarkMode(settings.darkMode);
  }

  function addSearchKey() {
    // Generate next available ID
    const maxId =
      settings.searchKeys.length > 0 ? Math.max(...settings.searchKeys.map((sk) => sk.id)) : 0;
    const newId = maxId + 1;
    settings.searchKeys = [...settings.searchKeys, { id: newId, key: '' }];
  }

  function removeSearchKey(index: number) {
    settings.searchKeys = settings.searchKeys.filter((_, i) => i !== index);
  }

  function updateSearchKeyKey(index: number, key: string) {
    settings.searchKeys[index].key = key;
  }
</script>

<div class="container mx-auto py-8 px-4 max-w-4xl">
  <div class="mb-8">
    <h1 class="text-3xl font-bold">Nastavení</h1>
    <p class="text-muted-foreground mt-2">Spravujte předvolby a nastavení svého účtu</p>
  </div>

  <div class="space-y-6">
    <!-- Reports Settings -->
    <Card>
      <CardHeader>
        <CardTitle>Záznamy</CardTitle>
        <CardDescription>Nastavte předvolby pro práci se záznamy</CardDescription>
      </CardHeader>
      <CardContent class="space-y-6">
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <Label>Vyhledávací klíče</Label>
            <Button variant="outline" size="sm" onclick={addSearchKey} type="button">
              <PlusIcon class="h-4 w-4 mr-1" />
              Přidat klíč
            </Button>
          </div>
          <p class="text-sm text-muted-foreground">
            Definujte klíče, které mohou vyhledávány v záznamech pacientů
          </p>

          {#if settings.searchKeys.length === 0}
            <div
              class="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-md"
            >
              Zatím nejsou definovány žádné vyhledávací klíče
            </div>
          {:else}
            <div class="space-y-2">
              {#each settings.searchKeys as searchKey, index (searchKey.id)}
                <div class="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Zadejte vyhledávací klíč"
                    value={searchKey.key}
                    oninput={(e) => updateSearchKeyKey(index, e.currentTarget.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onclick={() => removeSearchKey(index)}
                    type="button"
                  >
                    <XIcon class="h-4 w-4" />
                  </Button>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </CardContent>
    </Card>

    <!-- Appearance Settings -->
    <Card>
      <CardHeader>
        <CardTitle>Vzhled</CardTitle>
        <CardDescription>Přizpůsobte si vzhled aplikace</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <Label for="dark-mode">Tmavý režim</Label>
            <p class="text-sm text-muted-foreground">
              Zapnout tmavý režim pro lepší zobrazení v noci
            </p>
          </div>
          <Checkbox
            id="dark-mode"
            bind:checked={settings.darkMode}
            onchange={handleDarkModeChange}
          />
        </div>
      </CardContent>
    </Card>

    <!-- Save Button -->
    <div class="flex justify-end gap-4">
      <Button variant="outline" onclick={handleReset} disabled={isSaving}>Obnovit</Button>
      <Button onclick={handleSave} disabled={isSaving}>
        {isSaving ? 'Ukládání...' : 'Uložit nastavení'}
      </Button>
    </div>
  </div>
</div>
