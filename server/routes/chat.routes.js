const express = require('express');
const { createResponse } = require('../controllers/chat.controller');

const router = express.Router();

router.post('/', createResponse);

module.exports = router;