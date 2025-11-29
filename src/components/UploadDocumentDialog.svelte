<script lang="ts">
  import * as Dialog from '$components/ui/dialog';
  import { Button } from '$components/ui/button';
  import { Checkbox } from '$components/ui/checkbox';
  import { Label } from '$components/ui/label';
  import { Input } from '$components/ui/input';

  type Props = {
    open?: boolean;
  };

  let { open = $bindable(false) }: Props = $props();

  let selectedFile: FileList | undefined = $state(undefined);
  let checkboxes = $state({
    personalData: false,
    medicalHistory: false,
    diagnoses: false,
    medications: false
  });

  function handleSubmit() {
    const selectedOptions = Object.entries(checkboxes)
      .filter(([, checked]) => checked)
      .map(([key]) => key);

    console.log('Uploaded file:', selectedFile?.[0]);
    console.log('Selected options:', selectedOptions);

    // TODO: Add your submission logic here

    // Reset and close dialog
    resetForm();
    open = false;
  }

  function resetForm() {
    selectedFile = undefined;
    checkboxes = {
      personalData: false,
      medicalHistory: false,
      diagnoses: false,
      medications: false
    };
  }

  function handleCancel() {
    resetForm();
    open = false;
  }
</script>

<Dialog.Root bind:open>
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
        <Input id="file-upload" type="file" accept=".xml" bind:files={selectedFile} />
      </div>

      <div class="space-y-3 pt-2">
        <Label>Vyberte data k zobrazení</Label>

        <div class="flex items-center space-x-2">
          <Checkbox id="personal-data" bind:checked={checkboxes.personalData} />
          <Label for="personal-data" class="cursor-pointer">Osobní údaje</Label>
        </div>

        <div class="flex items-center space-x-2">
          <Checkbox id="medical-history" bind:checked={checkboxes.medicalHistory} />
          <Label for="medical-history" class="cursor-pointer">Zdravotní historie</Label>
        </div>

        <div class="flex items-center space-x-2">
          <Checkbox id="diagnoses" bind:checked={checkboxes.diagnoses} />
          <Label for="diagnoses" class="cursor-pointer">Diagnózy</Label>
        </div>

        <div class="flex items-center space-x-2">
          <Checkbox id="medications" bind:checked={checkboxes.medications} />
          <Label for="medications" class="cursor-pointer">Medikace</Label>
        </div>
      </div>
    </div>

    <Dialog.Footer>
      <Button variant="outline" onclick={handleCancel}>Zrušit</Button>
      <Button onclick={handleSubmit}>Odeslat</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
