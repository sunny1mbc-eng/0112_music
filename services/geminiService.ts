
import { GoogleGenAI, Type } from "@google/genai";
import { RecommendationResponse } from "../types.ts";

export const fetchCommuteSongs = async (theme: string): Promise<RecommendationResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `Recommend 7 songs suitable for a commute (bus/subway) based on the theme or genre: "${theme}". 
  Strict Requirements:
  1. Exactly 7 songs in total.
  2. 5 songs MUST be Korean (K-Pop, Indie, etc.) and 2 songs MUST be International (Pop, Rock, etc.) to maintain a 7:3 ratio.
  3. Provide a brief one-sentence reason why each song is good for commuting.
  4. Response must be in JSON format.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          songs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                artist: { type: Type.STRING },
                origin: { type: Type.STRING, enum: ['Korean', 'International'] },
                description: { type: Type.STRING }
              },
              required: ["title", "artist", "origin", "description"]
            }
          }
        },
        required: ["songs"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as RecommendationResponse;
};
