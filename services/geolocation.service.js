const axios = require('axios');

async function geocode(location) {
  const url = `http://api.positionstack.com/v1/forward?access_key=${process.env.GEOLOCATION_API_KEY}&query=${encodeURIComponent(location)}&limit=1`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (!data || !data.data || data.data.length === 0) {
      throw new Error('No results from PositionStack');
    }

    const place = data.data[0];

    return {
      latitude: place.latitude,
      longitude: place.longitude,
      label: place.label,
    };
  } catch (error) {
    console.error('Geocode service error: ', error.message);

    if (error.response) {
      throw new Error('GEOCODE_API_ERROR');
    }

    if (error.message === 'NO_RESULTS') {
      throw error; 
    }

    throw new Error('GEOCODE_FETCH_FAILED');
  }
}

module.exports = {
  geocode,
};