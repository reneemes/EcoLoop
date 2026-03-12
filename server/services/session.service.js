const connection = require('../db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function create(username, password) {
  const [result] = await connection.promise().query(
    `SELECT id, username, email, password
    FROM users
    WHERE LOWER(username) = LOWER(?);`,
    [username]
  );

  const user = result[0];

  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!user || !passwordMatch) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    {id: user.id},
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    }
  }
}

module.exports = {
  // show,
  create
};