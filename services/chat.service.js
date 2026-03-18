const { GoogleGenAI } = require("@google/genai");
const createConnection = require('../db.js');

async function index(userId) {
  const db = await createConnection();

  const [result] = await db.promise().query(
    `SELECT id, keyword, result
    FROM search_history
    WHERE user_id = ?;`,
    [userId]
  );
  return result;
}

async function create(prompt) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
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
  index,
  create,
  save,
  destroy,
}