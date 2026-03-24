const sessionService = require('../services/session.service.js');

const isProd = process.env.NODE_ENV === 'production';
const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  path: '/',
};

async function checkSession(req, res) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await sessionService.show(req.user.userId);

    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
}

async function createSession(req, res) {
  const { username, password } = req.body;
  
  try {
    const { token, user } = await sessionService.create(
      username,
      password
    );
    
    res
      .cookie('token', token, {
        cookieOptions,
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

async function logout(req, res) {
  res.clearCookie('token', cookieOptions);
  res.status(200).json({ message: 'Sign out successful' });
};

module.exports = {
  checkSession,
  createSession,
  logout,
};