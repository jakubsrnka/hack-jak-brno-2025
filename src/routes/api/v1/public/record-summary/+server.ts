import { json } from '@sveltejs/kit';
import { OPENAI_API_KEY } from '$env/static/private';
import OpenAI from 'openai';
import recordSchema from '$lib/server/openai/record-schema.json?raw';
import recordPrompt from '$lib/server/openai/prompt-record.txt?raw';
import type { PatientRecordsResponse } from '$types/pocketbase';

const friend = new OpenAI({
  apiKey: OPENAI_API_KEY
});

type RequestBody = {
  record: PatientRecordsResponse;
  wantedKeyParts: string[];
};

export const POST = async ({ request }) => {
  const body = (await request.json()) as RequestBody;

  const { record, wantedKeyParts } = body;

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

  return json({
    id: record.id,
    ...JSON.parse(recordResponse.output_text)
  });
};
