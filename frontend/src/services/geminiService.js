// c:\Users\siddh\biteRite\src\services\geminiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// NOTE: In a real app, use import.meta.env.VITE_GEMINI_API_KEY
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 
const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateRecipes(ingredients, healthPreferences) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a chef. Create 4 recipes based on these ingredients: "${ingredients}".
      Consider these health conditions: ${healthPreferences.join(", ")}.
      
      Return the response strictly as a JSON array of objects. 
      Each object must have:
      - "title": string (Recipe Name)
      - "time": string (e.g., "30 mins")
      - "calories": string (e.g., "350 kcal")
      - "ingredients": array of strings
      - "instructions": array of strings
      
      Do not include markdown formatting (like \`\`\`json), just the raw JSON array.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up any potential markdown formatting from the LLM
    const jsonString = text.replace(/```json|```/g, "").trim();
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error generating recipes:", error);
    return [];
  }
}
