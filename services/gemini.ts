import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  if (!process.env.API_KEY) return null;
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateSystemLog = async (): Promise<string> => {
  try {
    const ai = getAI();
    if (!ai) {
      return "SYSTEM_WARN: API_KEY_MISSING // RUNNING_SIMULATION_MODE";
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate a single, short, cryptic, cyberpunk-style system status log line (max 10 words). Use technical jargon. No quotes.",
      config: { temperature: 1.1 }
    });

    return response.text || "SYSTEM_STATUS: OPTIMAL // ENTROPY_STABILIZED";
  } catch (error) {
    console.error("AI Log Error:", error);
    return "ERR: NEURAL_LINK_FAILED";
  }
};

export const generateTechAnalysis = async (context: string): Promise<string> => {
  try {
    const ai = getAI();
    if (!ai) return "SIMULATION: Advanced shader compilation running at 99% efficiency.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the following technical context: "${context}". Generate a 2-sentence sophisticated, futuristic technical description for a high-end tech website. Sound elite, intelligent, and abstract.`,
      config: { temperature: 0.9 }
    });

    return response.text || "Analysis complete. Integrity stabilized at maximum efficiency.";
  } catch (error) {
    return "Unable to connect to Neural Core for analysis.";
  }
};

export const generateMissionStatement = async (): Promise<string> => {
  try {
    const ai = getAI();
    if (!ai) return "Our mission is to bridge the gap between biological intent and digital execution through advanced probabilistic rendering engines.";
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Write a short, cryptic, high-tech mission statement for a cyberpunk AI company. 2 sentences max. Use words like 'entropy', 'convergence', 'neural'.",
      config: { temperature: 1.0 }
    });
    return response.text || "Convergence of silicon and synapse.";
  } catch (e) {
    return "Error generating mission directive.";
  }
};

export const analyzeIdentity = async (identity: string): Promise<string> => {
  try {
    const ai = getAI();
    if (!ai) return "IDENTITY_UNKNOWN: PROCEED_WITH_CAUTION // CLASS: ROGUE";
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the identity "${identity}". Assign a fictional cyberpunk class (e.g., Netrunner, Corp, Fixer), a threat level (Low/Med/Critical), and a cryptic 1-sentence bio. Format: "CLASS: [Class] // THREAT: [Level] // BIO: [Bio]"`,
      config: { temperature: 1.2 }
    });
    return response.text || "SCAN_ERROR: SIGNAL_INTERFERENCE";
  } catch (e) {
    return "ERR: IDENTITY_DB_OFFLINE";
  }
};

export const generateTrendForecast = async (): Promise<string> => {
  try {
    const ai = getAI();
    if (!ai) return "FORECAST: POSITIVE // VECTOR: EXPONENTIAL";
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate a futuristic, abstract technology trend forecast (max 10 words). E.g. 'Neural lace adoption exceeding 40%'.",
      config: { temperature: 0.9 }
    });
    return response.text || "SYNC: QUANTUM_ENTANGLEMENT_STABLE";
  } catch (e) {
    return "ERR: PREDICTION_MODEL_FAILED";
  }
};