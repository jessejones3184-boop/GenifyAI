import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Use GEMINI_API_KEY as per guidelines
let aiInstance: GoogleGenAI | null = null;

const getAi = () => {
  if (!aiInstance) {
    // Hardcoded API Key as requested by user
    const apiKey = "AIzaSyBgz2zFOeM0ECscsBGNS9Jy94bDLrmYo3I";
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const analyzeLuxuryProduct = async (base64Image: string, productNotes?: string): Promise<AnalysisResult> => {
  const ai = getAi();
  const modelName = 'gemini-3.1-pro-preview';
  
  const prompt = `
    You are a Senior Luxury Authentication Expert at Genify.
    Your objective is to perform a high-precision audit on the provided image to identify if the luxury item (handbag, watch, sneaker, etc.) is authentic or a counterfeit/replica.
    
    ${productNotes ? `User Notes: ${productNotes}` : ''}

    Technical Analysis Protocol:
    1. Google Search Grounding: Use Google Search to research the specific item model. Look for "real vs fake" guides for this specific brand and model. Compare the item in the image with known authentic and counterfeit markers found in these guides.
    2. Batch Code & Serial Number Verification: Identify any batch codes, date codes, or serial numbers. Use Google Search to verify if these codes follow the brand's authentic patterns or if they are known "common fake" codes used by counterfeiters. Check multiple authentication databases if possible.
    3. Material & Texture Comparison: Analyze the material (leather grain, canvas weave, hardware metal) and compare it with the standards of authentic pieces found via search. Look for "plasticity", "chemical sheen", or incorrect grain patterns common in fakes.
    4. Hardware & Engraving: Examine logo font, engraving depth, and metallic alloy consistency against authentic reference images.
    5. Construction: Look for structural integrity, edge paint quality, and alignment of patterns.

    Analyze with the precision required for high-end collectors. Compare findings with known authentic and counterfeit indicators found online.
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
        tools: [{ googleSearch: {} }],
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
            forensicReport: { type: Type.STRING, description: 'Full technical breakdown of the authentication process including search findings' },
            materialAnalysis: { type: Type.STRING, description: 'Detailed analysis of materials, textures, and finishes compared to authentic standards' },
            batchCodeVerification: { type: Type.STRING, description: 'Results of serial number or date code verification against known databases and patterns' }
          },
          required: ['isAI', 'confidence', 'detections', 'verdict', 'forensicReport', 'materialAnalysis', 'batchCodeVerification']
        }
      }
    });

    const result = JSON.parse(response.text);
    
    // Extract search sources if available
    const sources: { title: string; url: string }[] = [];
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    if (groundingMetadata?.groundingChunks) {
      groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title,
            url: chunk.web.uri
          });
        }
      });
    }

    return { ...result, sources };
  } catch (error) {
    console.error("Luxury Authentication Pipeline Error:", error);
    throw new Error("Authentication analysis failed. The image may be unclear or the service is temporarily unavailable.");
  }
};
