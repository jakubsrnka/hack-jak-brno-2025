import { json } from '@sveltejs/kit';
import { OPENAI_API_KEY } from '$env/static/private';
import OpenAI from 'openai';
import reportSchema from '$lib/server/openai/report-schema.json';
import recordSchema from '$lib/server/openai/record-schema.json?raw';
import reportPrompt from '$lib/server/openai/prompt-report.txt';
import recordPrompt from '$lib/server/openai/prompt-record.txt';
import type { PatientRecordsResponse, PatientReportsResponse } from '$types/pocketbase';
import type { KeyPart } from '$types/openai';

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

  const response = await friend.responses.create({
    model: 'gpt-5.1',
    input: `${reportPrompt}

${wantedKeyParts.join(', ')}

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

  const recordResponses = await Promise.all(
    report.expand.patientRecords_via_report.map(async (record) => {
      const recordResponse = await friend.responses.create({
        model: 'gpt-5.1',
        input: `${recordPrompt}

${wantedKeyParts.join(', ')}
Max key parts: ${Math.floor(record.text.split(' ').length / WORDS_PER_KEYPART)}

${JSON.stringify(record)}
`,
        text: {
          format: {
            type: 'json_schema',
            name: 'record',
            schema: JSON.parse(recordSchema.replace('"__AVAILABLE_KEYPART_TYPES__"', wantedKeyParts.map((k) => `"${k}"`).join(', ')))
          }
        }
      });

      return {
        id: record.id,
        ...JSON.parse(recordResponse.output_text)
      };
    })
  );

  return json({
    ...JSON.parse(response.output_text),
    records: recordResponses
  });
};
