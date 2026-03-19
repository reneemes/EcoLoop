const express = require('express');
const auth = require("../middleware/auth.js");
const { 
  getRecycleHistory,
  createRecycleHistory
} = require('../controllers/recycle.controller.js');

const router = express.Router();

router.get('/', auth, getRecycleHistory);
router.post('/', auth, createRecycleHistory);

module.exports = router;