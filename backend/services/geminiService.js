const { GoogleGenerativeAI } = require("@google/generative-ai");

console.log("Gemini API Key:", process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateRecipe(ingredients, healthConditions) {

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview"
    });

    const prompt = `
    Generate 4 healthy recipes using these ingredients:

    ${ingredients.join(", ")}

    Health conditions: ${healthConditions.join(", ")}

    Return ONLY valid JSON array with this format:

    [
    {
    "title": "",
    "imageQuery": "short food search phrase",
    "time": "",
    "ingredients": [],
    "instructions": [],
    "calories": ""
    }
    ]

    Rules:
    - imageQuery should be 2–4 words describing the dish
    - imageQuery must be suitable for searching food photos
    - Example imageQuery: "shakshuka eggs", "tomato omelette", "chicken salad"
    `;

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    return text;

  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}

module.exports = { generateRecipe };