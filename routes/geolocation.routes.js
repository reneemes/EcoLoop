const express = require('express');
const { geocodeHandler } = require('../controllers/geolocation.controller');

const router = express.Router();

router.get('/', geocodeHandler);

module.exports = router;