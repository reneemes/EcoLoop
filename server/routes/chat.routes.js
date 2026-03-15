const express = require('express');
const auth = require("../middleware/auth.js");
const { createResponse, saveResponse } = require('../controllers/chat.controller');

const router = express.Router();

router.post('/', createResponse);
router.post('/save', auth, saveResponse);

module.exports = router;