const userService = require('../services/user.service.js');

async function createUser(req, res) {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(422).json({
      message: 'All fields are required',
    });
  }

  try {
    const result = await userService.create(
      username,
      password,
      email
    );

    res.status(201).json({
      message: 'User created successfully',
      userId: result.insertId,
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        message: 'Username or email already exists',
      });
    }

    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
}

module.exports = {
  createUser,
}