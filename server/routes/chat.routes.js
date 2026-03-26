const express = require('express');
const auth = require("../middleware/auth.js");
const { 
  getResponses, 
  createResponse, 
  saveResponse, 
  deleteResponse 
} = require('../controllers/chat.controller');

const router = express.Router();

router.get('/', auth, getResponses);
router.post('/', createResponse);
router.post('/save', auth, saveResponse);
router.delete('/:id', auth, deleteResponse);

module.exports = router;