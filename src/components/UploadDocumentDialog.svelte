<script lang="ts">
  import * as Dialog from '$components/ui/dialog';
  import { Button } from '$components/ui/button';
  import { Checkbox } from '$components/ui/checkbox';
  import { Label } from '$components/ui/label';
  import { Input } from '$components/ui/input';
  import { Spinner } from '$components/ui/spinner';
  import { REPORT_SUMMARY_OPTIONS } from '$lib/constants/reportSummaryOptions';
  import { convertXML } from 'simple-xml-to-json';
  import type { XmlDocumentation } from '$types/xmlDocumentation';

  type Props = {
    open?: boolean;
  };

  let { open = $bindable(false) }: Props = $props();

  const reportOptions = REPORT_SUMMARY_OPTIONS;

  let isLoading = $state(false);
  let selectedFile: FileList | undefined = $state(undefined);
  let checkboxes = $state<Record<string, boolean>>(
    reportOptions.reduce(
      (acc, option) => {
        acc[option.id] = option.defaultValue;
        return acc;
      },
      {} as Record<string, boolean>
    )
  );

  function handleSubmit() {
    if (!selectedFile || selectedFile.length === 0) {
      alert('Prosím, nahrajte XML dokument.');
      return;
    }

    const selectedOptions = Object.entries(checkboxes)
      .filter(([, checked]) => checked)
      .map(([key]) => key);
    console.log('Selected options:', selectedOptions);

    isLoading = true;

    const reader = new FileReader();
    reader.readAsText(selectedFile[0]);
    reader.onload = () => {
      try {
        const xmlContent = reader.result as string;
        const data = convertXML(xmlContent) as XmlDocumentation;
        console.log('Converted JSON data:', data);

        resetForm();
        open = false;
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
    checkboxes = reportOptions.reduce(
      (acc, option) => {
        acc[option.id] = option.defaultValue;
        return acc;
      },
      {} as Record<string, boolean>
    );
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

        {#each reportOptions as option (option.id)}
          <div class="flex items-center space-x-2">
            <Checkbox id={option.id} bind:checked={checkboxes[option.id]} disabled={isLoading} />
            <Label for={option.id} class="cursor-pointer">{option.label}</Label>
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
