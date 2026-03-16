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
  return result[0];
}

async function destroy(id, userId) {
  const db = await createConnection();

  const [result] = await db.promise().query(
    `DELETE FROM search_history
    WHERE id = ?
      AND user_id = ?`,
    [id, userId]
  );

  return result;
}

module.exports = {
  create,
  save,
  destroy,
}