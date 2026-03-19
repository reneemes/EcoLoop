const createConnection = require('../db.js');

async function index(userId) {
  const db = createConnection();

  const [result] = await db.promise().query(
    `SELECT item_type, item_name, quantity, recycled_at
    FROM recycle_history
    WHERE user_id = ?;`,
    [userId]
  );
  
  return result;
}

async function create(userId, type, item_name, quantity, recycled_at) {
  const db = createConnection();

  const [result] = await db.promise().query(
    `INSERT INTO recycle_history (item_type, item_name, quantity, recycled_at, user_id)
    VALUES (?, ?, ?, ?, ?);`,
    [type, item_name, quantity, recycled_at, userId]
  );

  return result;
}

module.exports = {
  index,
  create,
};