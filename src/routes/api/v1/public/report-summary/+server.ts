import { json } from '@sveltejs/kit';
import { OPENAI_API_KEY } from '$env/static/private';
import OpenAI from 'openai';
import reportSchema from '$lib/server/openai/report-schema.json';
import recordSchema from '$lib/server/openai/record-schema.json?raw';
import reportPrompt from '$lib/server/openai/prompt-report.txt?raw';
import recordPrompt from '$lib/server/openai/prompt-record.txt?raw';
import type { PatientRecordsResponse, PatientReportsResponse } from '$types/pocketbase';
import type { KeyPart } from '$types/openai';

const friend = new OpenAI({
  apiKey: OPENAI_API_KEY
});

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
    model: 'gpt-5-nano',
    input: `${reportPrompt}

${wantedKeyParts.join(', ')}

Contents:
\`\`\`
${report.expand.patientRecords_via_report.map((r) => r.text).join('\n\n---\n')}
\`\`\`
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
      const RECORD_REPLACEMENTS: Record<string, string> = {
        '"__AVAILABLE_KEYPART_TYPES__"': wantedKeyParts.map((k) => `"${k}"`).join(', '),
        '"__MAX_SUMMARY_LENGTH__"': (record.text.length * 0.4).toFixed(0).toString()
      };
      const recordResponse = await friend.responses.create({
        model: 'gpt-5.1',
        input: `${recordPrompt}

${wantedKeyParts.join(', ')}

Contents:
\`\`\`
${record.text}
\`\`\`
`,
        text: {
          format: {
            type: 'json_schema',
            name: 'record',
            schema: JSON.parse(
              Object.entries(RECORD_REPLACEMENTS).reduce(
                (acc, [key, value]) => acc.replaceAll(key, value),
                recordSchema
              )
            )
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
