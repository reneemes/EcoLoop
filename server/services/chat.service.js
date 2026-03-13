const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function create(prompt) {
  try{
    console.log('here')
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    console.log(response.text);
    return response.text;
  } catch (error) {
    console.error(error);
    throw new Error('Response generation failed');
  }
}

module.exports = {
  create,
}