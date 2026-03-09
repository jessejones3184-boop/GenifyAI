import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Use GEMINI_API_KEY as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const analyzeLuxuryProduct = async (base64Image: string, productNotes?: string): Promise<AnalysisResult> => {
  const modelName = 'gemini-3-flash-preview';
  
  const prompt = `
    You are a Senior Luxury Authentication Expert at Genify.
    Your objective is to perform a high-precision audit on the provided image to identify if the luxury item (handbag, watch, sneaker, etc.) is authentic or a counterfeit/replica.
    
    ${productNotes ? `User Notes: ${productNotes}` : ''}

    Technical Analysis Protocol:
    1. Material & Texture: Analyze fabric weave, leather grain, and stitching precision. Identify synthetic materials vs authentic grains.
    2. Hardware & Engraving: Examine logo font weight, engraving depth, and metallic alloy consistency.
    3. Construction: Look for structural integrity, edge paint quality, and alignment of patterns.
    4. Optical Reality: Verify if the item's details match the known standards of the specific luxury brand.

    Analyze with the precision required for high-end collectors.
    Respond ONLY in a structured JSON format according to this schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/jpeg' } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isAI: { type: Type.BOOLEAN, description: 'True if the item is identified as a counterfeit/fake' },
            confidence: { type: Type.NUMBER, description: 'Authentication confidence score from 0.0 to 1.0' },
            detections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, description: 'Name of the detection (e.g., Stitching Irregularity, Logo Mismatch)' },
                  description: { type: Type.STRING, description: 'Detailed explanation of the finding' },
                  severity: { type: Type.STRING, enum: ['low', 'medium', 'high'] }
                },
                required: ['type', 'description', 'severity']
              }
            },
            verdict: { type: Type.STRING, description: 'Concise executive summary of the findings (Authentic vs Counterfeit)' },
            forensicReport: { type: Type.STRING, description: 'Full technical breakdown of the authentication process' }
          },
          required: ['isAI', 'confidence', 'detections', 'verdict', 'forensicReport']
        }
      }
    });

    const result = JSON.parse(response.text);
    return result;
  } catch (error) {
    console.error("Luxury Authentication Pipeline Error:", error);
    throw new Error("Authentication analysis failed. The image may be unclear or the service is temporarily unavailable.");
  }
};
