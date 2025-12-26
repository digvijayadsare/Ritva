
import { GoogleGenAI, Type } from "@google/genai";

export const generateRitualGuide = async (title: string, category: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a complete ritual guide for "${title}" (${category}). 
      Include setup instructions, a list of 'Puja Sahitya' (materials), and exactly 5 sequential steps. 
      For each step, provide a title, detailed description, and a relevant short Sanskrit Mantra (with transliteration). 
      Format as JSON.`,
      config: {
        systemInstruction: "You are an expert in Hindu Vedic traditions.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            setupInstructions: { type: Type.STRING },
            materials: { type: Type.ARRAY, items: { type: Type.STRING } },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  mantra: { type: Type.STRING }
                },
                required: ["title", "description"]
              }
            }
          },
          required: ["setupInstructions", "materials", "steps"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    const jsonStr = text.trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini failed:", error);
    return null;
  }
};
