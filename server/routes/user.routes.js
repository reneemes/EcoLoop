const express = require('express');
const { 
  // showUser, 
  createUser, 
  // updateUser 
} = require('../controllers/user.controller.js');

const router = express.Router();

// router.get('/:id', showUser);
router.post('/', createUser);
// router.post('/:id', updateUser);

module.exports = router;