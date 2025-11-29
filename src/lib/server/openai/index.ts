import { OPENAI_API_KEY } from '$env/static/private';
import OpenAI from 'openai';

export const friend = new OpenAI({
  apiKey: OPENAI_API_KEY
});
