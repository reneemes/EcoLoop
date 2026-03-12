const sessionService = require('../services/session.service.js');

async function createSession(req, res) {
  const { username, password } = req.body;
  
  try {
    const { token, user } = await sessionService.create(
      username,
      password
    );

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 3600000,
      })
      .status(201)
      .json({
        message: 'Sign in successful',
        user,
      });
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

module.exports = {
  createSession,
};