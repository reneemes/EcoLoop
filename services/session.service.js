const createConnection = require('../db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function show(userId) {
  const db = await createConnection();

  const [result] = await db.promise().query(
    `SELECT id, username, email, role
    FROM users
    WHERE id = ?`,
    [userId]
  );

  if (result.length === 0) {
    throw new Error("User not found");
  }

  const user = result[0];

  return {
    id: user.id,
    username: user.username,
    email: user.email,
  }
}

async function create(username, password) {
  const db = await createConnection();

  const [result] = await db.promise().query(
    `SELECT id, username, email, password, role
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
      role: user.role,
    }
  }
}

module.exports = {
  show,
  create
};