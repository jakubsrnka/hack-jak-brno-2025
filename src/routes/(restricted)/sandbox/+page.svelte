<script lang="ts">
  import { Button } from '$components/ui/button';
  import { Skeleton } from '$components/ui/skeleton';
  import { getPatientReport } from '$lib/services';

  let buttonText = $state('Send to AI');

  let input = $state<string | null>(null);
  let output = $state<string | null>(null);
  let loading = $state(false);

  const handleClick = async () => {
    try {
      loading = true;
      input = null;
      output = null;
      buttonText = 'Retrieving...';
      const report = await getPatientReport('sgqx2g5zu70ayj8');
      input = JSON.stringify(report, null, 2);
      buttonText = 'Sending...';

      const response = await fetch('/api/v1/public/report-summary', {
        method: 'POST',
        body: JSON.stringify({
          report,
          wantedKeyParts: [
            'Datum stanovení diagnózy',
            'Klinická a patologická TNM klasifikace',
            'Léčba mimo MOÚ'
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      type ReportSummaryResponse = {
        summary: string;
        shortSummary: string;
      };

      const data: ReportSummaryResponse = await response.json();

      // pbClient
      //   .collection(Collections.PatientReports)
      //   .update<PatientReportsRecord>('sgqx2g5zu70ayj8', {
      //     summary: data.summary,
      //     shortSummary: data.shortSummary
      //   });

      console.log('Report Summary:', data);
      output = JSON.stringify(data, null, 2);
      buttonText = 'Done';
      loading = false;
      setTimeout(() => {
        buttonText = 'Send to AI';
      }, 2000);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      buttonText = 'Error! Try again';
      loading = false;
      setTimeout(() => {
        buttonText = 'Send to AI';
      }, 2000);
    }
  };
</script>

<div class="max-w-full">
  <h1 class="mb-4 text-2xl font-bold">AI Report Summary:</h1>

  <Button onclick={handleClick}>{buttonText}</Button>
  <div class="max-w-full mt-4 overflow-x-auto">
    {#if output}
      <h2 class="mt-6 mb-2 text-xl font-semibold">Output:</h2>
      <pre>{output}</pre>
      <h2 class="mt-6 mb-2 text-xl font-semibold">Input:</h2>
      <pre>{input}</pre>
    {:else if loading}
      <Skeleton class="h-96 w-full mt-4" />
    {/if}
  </div>
</div>
