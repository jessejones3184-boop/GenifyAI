
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const analyzeImageForensics = async (base64Image: string): Promise<AnalysisResult> => {
  const modelName = 'gemini-3-flash-preview';
  
  const prompt = `
    You are a Senior Luxury Authentication Expert at Genify, the global leader in high-end asset verification.
    Your objective is to perform a high-precision forensic audit on the provided image to identify if the luxury item (handbag, watch, sneaker, etc.) is authentic or a counterfeit/replica.
    
    Technical Analysis Protocol:
    1. Material & Texture: Analyze fabric weave, leather grain, and stitching precision. Identify synthetic polymer structures vs authentic animal grains.
    2. Hardware & Engraving: Examine logo font weight, engraving depth, and metallic alloy consistency.
    3. Construction: Look for structural integrity, edge paint quality, and alignment of patterns.
    4. Batch & Serial: Check for font consistency in serial numbers or batch codes if visible.
    5. Optical Reality: Verify if the item's details match the known standards of the specific luxury brand.

    Analyze with the precision required for high-end collectors and resale platforms (Grailed, StockX, etc.).
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
            isAI: { type: Type.BOOLEAN, description: 'True if image is identified as synthetic or heavily modified' },
            confidence: { type: Type.NUMBER, description: 'Forensic confidence score from 0.0 to 1.0' },
            detections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, description: 'Technical name of the detection (e.g., FFT Artifact, Raytracing Mismatch)' },
                  description: { type: Type.STRING, description: 'Detailed technical explanation' },
                  severity: { type: Type.STRING, enum: ['low', 'medium', 'high'] }
                },
                required: ['type', 'description', 'severity']
              }
            },
            verdict: { type: Type.STRING, description: 'Concise executive summary of the findings' },
            forensicReport: { type: Type.STRING, description: 'Full technical forensic breakdown' }
          },
          required: ['isAI', 'confidence', 'detections', 'verdict', 'forensicReport']
        }
      }
    });

    const result = JSON.parse(response.text);
    return result;
  } catch (error) {
    console.error("Optic Forensic Pipeline Error:", error);
    throw new Error("Forensic analysis aborted. Input data may be corrupted or incompatible.");
  }
};
