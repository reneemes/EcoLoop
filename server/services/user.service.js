const createConnection = require('../db.js');
const bcrypt = require('bcryptjs');

async function create(username, password, email) {
  const db = await createConnection();
  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await db.promise().query(
    `INSERT INTO users (username, password, email)
    VALUES (?, ?, ?);`,
    [username, hashedPassword, email]
  );

  return result;
}

module.exports = {
  create,
};