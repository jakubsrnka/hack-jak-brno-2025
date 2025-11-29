<script lang="ts">
  import { Button } from '$components/ui/button';
  import { Checkbox } from '$components/ui/checkbox';
  import { Label } from '$components/ui/label';
  import { Input } from '$components/ui/input';
  import { Spinner } from '$components/ui/spinner';
  import { defaultSearchKeys, type SearchKey } from '$lib/constants/settingsDefaults';
  import { currentUser } from '$lib/pocketbase';
  import { convertXML } from 'simple-xml-to-json';
  import type { XmlDocumentation } from '$types/xmlDocumentation';
  import {
    extractDocumentationRecords,
    extractPatientIdFromData
  } from '$lib/helpers/xmlDocumentationToPBType';
  import {
    batchSetRecordsAIData,
    createEmptyReport,
    createRecords,
    getPatientReport,
    insertPatient,
    setReportSummary
  } from '$lib/services';
  import * as Dialog from '$components/ui/dialog';
  import { goto } from '$app/navigation';
  import { SvelteMap } from 'svelte/reactivity';
  import type { AIResponse } from '$types/openai';

  type Props = {
    open?: boolean;
  };

  let { open = $bindable(false) }: Props = $props();

  // Get search keys from user settings or use defaults
  const searchKeys = $derived(
    ($currentUser?.settings as { searchKeys?: SearchKey[] } | null)?.searchKeys?.length
      ? (($currentUser?.settings as { searchKeys: SearchKey[] })?.searchKeys ?? defaultSearchKeys)
      : defaultSearchKeys
  );

  let isLoading = $state(false);
  let selectedFile: FileList | undefined = $state(undefined);

  // Store checkbox overrides (keys that user has toggled) using SvelteMap for reactivity
  let checkboxOverrides = new SvelteMap<string, boolean>();

  // Derive checkbox states based on current searchKeys and overrides
  const checkboxes = $derived.by(() => {
    const state: Record<string, boolean> = {};
    for (const key of searchKeys) {
      const keyId = `search-key-${key.id}`;
      // Use override if available, otherwise default to true (checked)
      state[keyId] = checkboxOverrides.has(keyId) ? checkboxOverrides.get(keyId)! : true;
    }
    return state;
  });

  function setCheckboxValue(keyId: string, value: boolean) {
    checkboxOverrides.set(keyId, value);
  }

  async function handleStoreXmlData(xmlContent: string) {
    const data = convertXML(xmlContent) as XmlDocumentation;
    const patientId = extractPatientIdFromData(data);
    const patient = await insertPatient(patientId);
    const report = await createEmptyReport(patient.id);
    const records = extractDocumentationRecords(data, patient.id);
    await createRecords(report.id, records);

    // We send labels to the model
    const selectedLabels: string[] = searchKeys
      .filter((searchKey) => checkboxes[`search-key-${searchKey.id}`])
      .map((searchKey) => searchKey.key);
    console.log('Selected checkbox labels:', selectedLabels);

    const fullReport = await getPatientReport(report.id);

    const response = await fetch('/api/v1/public/report-summary', {
      method: 'POST',
      body: JSON.stringify({
        report: fullReport,
        wantedKeyParts: selectedLabels
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData = (await response.json()) as AIResponse;
    await setReportSummary(report.id, responseData.summary, responseData.shortSummary);
    await batchSetRecordsAIData(responseData.records);
    return { patient, report };
  }

  function handleSubmit() {
    if (!selectedFile || selectedFile.length === 0) {
      alert('Prosím, nahrajte XML dokument.');
      return;
    }

    isLoading = true;

    const reader = new FileReader();
    reader.readAsText(selectedFile[0]);
    reader.onload = async () => {
      try {
        const xmlContent = reader.result as string;
        const { patient, report } = await handleStoreXmlData(xmlContent);
        resetForm();
        open = false;
        await goto('/patients/' + patient.id + '/report/' + report.id);
      } catch (error) {
        console.error('Error processing XML:', error);
        alert('Chyba při zpracování XML dokumentu.');
      } finally {
        isLoading = false;
      }
    };
    reader.onerror = () => {
      console.error('Error reading file');
      alert('Chyba při čtení souboru.');
      isLoading = false;
    };
  }

  function resetForm() {
    selectedFile = undefined;
    isLoading = false;
    checkboxOverrides.clear(); // Clear all overrides, defaults to all checked
  }

  function handleCancel() {
    resetForm();
    open = false;
  }
</script>

<Dialog.Root bind:open onOpenChange={(isOpen) => isOpen || !isLoading}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Nahrát dokumentaci</Dialog.Title>
      <Dialog.Description>
        Nahrajte XML dokument a vyberte data, která chcete zobrazit.
      </Dialog.Description>
    </Dialog.Header>

    <div class="space-y-4 py-4">
      <div class="space-y-2">
        <Label for="file-upload">XML dokument</Label>
        <Input
          id="file-upload"
          type="file"
          accept=".xml"
          bind:files={selectedFile}
          disabled={isLoading}
        />
      </div>

      <div class="space-y-3 pt-2">
        <Label>Vyberte data k zobrazení</Label>

        {#each searchKeys as searchKey (searchKey.id)}
          {@const keyId = `search-key-${searchKey.id}`}
          {@const isChecked = checkboxes[keyId]}
          <div class="flex items-center space-x-2">
            <Checkbox
              id={keyId}
              checked={isChecked}
              onchange={() => setCheckboxValue(keyId, !isChecked)}
              disabled={isLoading}
            />
            <Label for={keyId} class="cursor-pointer">{searchKey.key}</Label>
          </div>
        {/each}
      </div>
    </div>

    <Dialog.Footer>
      <Button variant="outline" onclick={handleCancel} disabled={isLoading}>Zrušit</Button>
      <Button onclick={handleSubmit} disabled={isLoading}>Odeslat</Button>
    </Dialog.Footer>

    {#if isLoading}
      <div
        class="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
      >
        <Spinner class="size-12 text-primary" />
        <p class="mt-4 text-sm text-muted-foreground">Zpracovávám dokument...</p>
      </div>
    {/if}
  </Dialog.Content>
</Dialog.Root>
