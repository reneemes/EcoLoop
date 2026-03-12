const connection = require('../db.js');
const bcrypt = require('bcryptjs');

async function create(username, password, email) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await connection.promise().query(
    `INSERT INTO users (username, password, email)
    VALUES (?, ?, ?);`,
    [username, hashedPassword, email]
  );

  return result;
}

module.exports = {
  // show,
  create,
  // update,
};