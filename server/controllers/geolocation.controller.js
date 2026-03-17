const geoService = require('../services/geolocation.service');

async function geocodeHandler(req, res) {
  const { location } = req.body;

  if(!location) {
    return res.status(422).json({ message: 'All fields are required' });
  }

  try {
    const result = await geoService.geocode(location);

    return res.status(200).json(result);
  } catch (error) {
    if (error.message === 'NO_RESULTS') {
      return res.status(404).json({ message: 'Location not found' });
    }

    if (error.message === 'GEOCODE_API_ERROR') {
      return res.status(502).json({ message: 'Geocoding service error' });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  geocodeHandler,
};