import { json } from '@sveltejs/kit';
import { OPENAI_API_KEY } from '$env/static/private';
import OpenAI from 'openai';
import reportSchema from '$lib/server/openai/report-schema.json';
import reportPrompt from '$lib/server/openai/prompt-report.txt?raw';
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

  return json(JSON.parse(response.output_text));
};
