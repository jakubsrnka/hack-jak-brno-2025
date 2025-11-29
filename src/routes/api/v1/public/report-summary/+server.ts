import { json } from '@sveltejs/kit';
import { OPENAI_API_KEY } from '$env/static/private';
import OpenAI from 'openai';
import reportSchema from '$lib/server/openai/report-schema.json';
import prompt from '$lib/server/openai/prompt.txt';

const friend = new OpenAI({
  apiKey: OPENAI_API_KEY
});

// TODO: nechat si z FE poslat klíčový hodnoty, který chci zobrazit v summary
// TODO: v keyparts bude array objektů, kde objekt bude mít severity (důležitost v rámci)

// TODO: spočítat počet slov v recordu a podle toho spočítat maximální počet keyparts
// importance: 1 = high, 2 = medium, 3 = low
// position: pozice v původním textu, 0-based index slov
// reason: stručné zdůvodnění, proč je to důležité

export const GET = async () => {
  const response = await friend.responses.create({
    model: 'gpt-5.1',
    input: `${prompt}
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
