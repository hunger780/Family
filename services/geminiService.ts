import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBio = async (name: string, relationLabel: string = "family member"): Promise<string> => {
  try {
    const prompt = `
      Write a short, warm, and personal family biography (max 35 words) for a person named ${name}.
      They are described as: "${relationLabel}".
      Focus on their personality or hobbies suitable for a family tree.
      Do not include quotes or markdown formatting, just plain text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Bio generation unavailable.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not generate bio at this time.";
  }
};
