const { GoogleGenAI } = require("@google/genai");
const createConnection = require('../db.js');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function create(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error(error);
    throw new Error('Response generation failed');
  }
}

async function save(userId, keyword, chat) {
  const db = await createConnection();
  
  const [result] = await db.promise().query(
    `INSERT INTO search_history (user_id, keyword, result)
    VALUES (?, ?, ?);`,
    [userId, keyword, chat]
  );
  console.log('result: ', result);
  return result[0];
}

module.exports = {
  create,
  save,
}