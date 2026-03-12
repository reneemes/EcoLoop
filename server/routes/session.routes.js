const express = require('express');
const auth = require("../middleware/auth.js");
const { createSession } = require('../controllers/session.controller.js');

const router = express.Router();

// router.get('/', auth, checkSession);
router.post('/', createSession);
// router.post('/logout', logout);

module.exports = router;