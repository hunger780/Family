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

export const generateWelcomeMessage = async (recipientName: string, relation: string, senderName: string): Promise<string> => {
  try {
    const prompt = `
      Write a warm, welcoming email/letter to a new family member named ${recipientName}.
      Relationship context: ${recipientName} is my ${relation}.
      My name is ${senderName}.
      The tone should be inviting, excited, and family-oriented.
      Keep it under 80 words.
      Do not include subject lines or placeholders.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Welcome message generation unavailable.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Hi ${recipientName}, welcome to the family! We are so happy to have you join our digital family tree. Love, ${senderName}.`;
  }
};