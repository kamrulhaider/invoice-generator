import { GoogleGenAI, Type, Schema } from "@google/genai";
import { LineItem } from "../types";
import { v4 as uuidv4 } from 'uuid'; // We will simulate uuid with a simple math random for simplicity if uuid lib is not present, but let's assume standard JS generation
// Using a simple random ID generator to avoid external heavy deps for this demo if needed, but we will handle it in the transformation.

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const itemSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    description: { type: Type.STRING, description: "Description of the product or service" },
    quantity: { type: Type.NUMBER, description: "Quantity or hours worked" },
    rate: { type: Type.NUMBER, description: "Price per unit or hourly rate" },
  },
  required: ["description", "quantity", "rate"],
};

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    items: {
      type: Type.ARRAY,
      items: itemSchema,
    },
  },
};

export const parseInvoiceItemsFromText = async (text: string): Promise<Omit<LineItem, 'id' | 'amount'>[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Extract invoice line items from the following text. If a value is missing, make a reasonable guess or set it to 1 (for quantity) or 0 (for rate). \n\nInput Text: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are a helpful accounting assistant that extracts structured invoice data from unstructured descriptions.",
      },
    });

    const jsonText = response.text;
    if (!jsonText) return [];

    const data = JSON.parse(jsonText) as { items: { description: string; quantity: number; rate: number }[] };
    return data.items || [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to parse text with AI.");
  }
};
