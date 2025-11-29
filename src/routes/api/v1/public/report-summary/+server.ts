import { json } from '@sveltejs/kit';
import { OPENAI_API_KEY } from '$env/static/private';
import OpenAI from 'openai';
import reportSchema from '$lib/server/openai/report-schema.json';
import prompt from '$lib/server/openai/prompt.txt';
import type { PatientRecordsResponse, PatientReportsResponse } from '$types/pocketbase';
import type { KeyPart } from '$types/openai';
import { REPORT_SUMMARY_OPTIONS } from '$lib/constants/reportSummaryOptions.js';

const friend = new OpenAI({
  apiKey: OPENAI_API_KEY
});

const WORDS_PER_KEYPART = 50;

// TODO: nechat si z FE poslat klíčový hodnoty, který chci zobrazit v summary
// TODO: v keyparts bude array objektů, kde objekt bude mít severity (důležitost v rámci)

// TODO: spočítat počet slov v recordu a podle toho spočítat maximální počet keyparts
// importance: 1 = high, 2 = medium, 3 = low
// position: pozice v původním textu, 0-based index slov
// reason: stručné zdůvodnění, proč je to důležité

type RequestBody = {
  report: PatientReportsResponse<{
    patientRecords_via_report: PatientRecordsResponse<KeyPart[]>[];
  }>;
  wantedKeyParts: string[];
};

export const POST = async ({ request }) => {
  const body = (await request.json()) as RequestBody;

  const { report, wantedKeyParts } = body;

  // Calculate maxKeyParts for each record based on text length
  report.expand.patientRecords_via_report.map((r) => {
    console.log(`Record ID: ${r.id}, Text length: ${r.text.split(' ').length} words`);
    return {
      ...r,
      maxKeyParts: Math.min(
        Math.floor(r.text.split(' ').length / WORDS_PER_KEYPART),
        wantedKeyParts.length
      )
    };
  });

  const response = await friend.responses.create({
    model: 'gpt-5.1',
    input: `${prompt}

${wantedKeyParts.map((keyPart) => REPORT_SUMMARY_OPTIONS.find((option) => option.id === keyPart)?.label).join(', ')}

${JSON.stringify(report)}
`,
    text: {
      format: {
        type: 'json_schema',
        name: 'report',
        schema: reportSchema
      }
    }
  });

  return json(JSON.parse(response.output_text));
};
