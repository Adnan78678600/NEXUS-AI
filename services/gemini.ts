import { GoogleGenAI } from "@google/genai";
import { config, hasGeminiKey } from '../src/lib/config';
import { geminiRateLimiter, withTimeout, withRetry } from '../src/lib/rateLimiter';
import { captureError } from '../src/lib/sentry';

const API_TIMEOUT_MS = 10000;
const MAX_PROMPT_LENGTH = 500;

const getAI = () => {
  if (!hasGeminiKey()) return null;
  return new GoogleGenAI({ apiKey: config.geminiApiKey! });
};

function sanitizePrompt(input: string): string {
  return input
    .slice(0, MAX_PROMPT_LENGTH)
    .replace(/[<>]/g, '')
    .trim();
}

async function makeAIRequest(
  prompt: string,
  temperature: number,
  fallback: string
): Promise<string> {
  const ai = getAI();
  if (!ai) {
    return fallback;
  }

  if (!geminiRateLimiter.canMakeRequest()) {
    return "RATE_LIMIT: TOO_MANY_REQUESTS // RETRY_LATER";
  }

  geminiRateLimiter.recordRequest();

  const request = async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: sanitizePrompt(prompt),
      config: { temperature }
    });
    return response.text || fallback;
  };

  return withTimeout(
    withRetry(request, { maxRetries: 2, delayMs: 500 }),
    API_TIMEOUT_MS,
    'AI request timed out'
  );
}

export const generateSystemLog = async (): Promise<string> => {
  try {
    return await makeAIRequest(
      "Generate a single, short, cryptic, cyberpunk-style system status log line (max 10 words). Use technical jargon. No quotes.",
      1.1,
      "SYSTEM_WARN: API_KEY_MISSING // RUNNING_SIMULATION_MODE"
    );
  } catch (error) {
    captureError(error as Error, { context: 'generateSystemLog' });
    return "ERR: NEURAL_LINK_FAILED";
  }
};

export const generateTechAnalysis = async (context: string): Promise<string> => {
  try {
    const safeContext = sanitizePrompt(context);
    return await makeAIRequest(
      `Analyze the following technical context: "${safeContext}". Generate a 2-sentence sophisticated, futuristic technical description for a high-end tech website. Sound elite, intelligent, and abstract.`,
      0.9,
      "SIMULATION: Advanced shader compilation running at 99% efficiency."
    );
  } catch (error) {
    captureError(error as Error, { context: 'generateTechAnalysis' });
    return "Unable to connect to Neural Core for analysis.";
  }
};

export const generateMissionStatement = async (): Promise<string> => {
  try {
    return await makeAIRequest(
      "Write a short, cryptic, high-tech mission statement for a cyberpunk AI company. 2 sentences max. Use words like 'entropy', 'convergence', 'neural'.",
      1.0,
      "Our mission is to bridge the gap between biological intent and digital execution through advanced probabilistic rendering engines."
    );
  } catch (error) {
    captureError(error as Error, { context: 'generateMissionStatement' });
    return "Error generating mission directive.";
  }
};

export const analyzeIdentity = async (identity: string): Promise<string> => {
  try {
    const safeIdentity = sanitizePrompt(identity);
    return await makeAIRequest(
      `Analyze the identity "${safeIdentity}". Assign a fictional cyberpunk class (e.g., Netrunner, Corp, Fixer), a threat level (Low/Med/Critical), and a cryptic 1-sentence bio. Format: "CLASS: [Class] // THREAT: [Level] // BIO: [Bio]"`,
      1.2,
      "IDENTITY_UNKNOWN: PROCEED_WITH_CAUTION // CLASS: ROGUE"
    );
  } catch (error) {
    captureError(error as Error, { context: 'analyzeIdentity' });
    return "ERR: IDENTITY_DB_OFFLINE";
  }
};

export const generateTrendForecast = async (): Promise<string> => {
  try {
    return await makeAIRequest(
      "Generate a futuristic, abstract technology trend forecast (max 10 words). E.g. 'Neural lace adoption exceeding 40%'.",
      0.9,
      "FORECAST: POSITIVE // VECTOR: EXPONENTIAL"
    );
  } catch (error) {
    captureError(error as Error, { context: 'generateTrendForecast' });
    return "ERR: PREDICTION_MODEL_FAILED";
  }
};