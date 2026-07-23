import { createOpenAI } from '@ai-sdk/openai';

/**
 * Configure Vercel AI SDK OpenAI provider to point to OpenRouter.
 */
export const openrouter = createOpenAI({
  baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || '',
  headers: {
    'HTTP-Referer': 'https://biasly.app',
    'X-Title': 'biasly AI Article Pipeline',
  },
});

/**
 * Default model for AI Article Analysis when using OpenRouter.
 */
export const DEFAULT_ANALYSIS_MODEL = process.env.ANALYSIS_MODEL || 'google/gemini-2.5-flash';

/**
 * Get an AI model instance configured for OpenRouter.
 */
export function getAnalysisModel(modelName?: string) {
  return openrouter(modelName || DEFAULT_ANALYSIS_MODEL);
}
