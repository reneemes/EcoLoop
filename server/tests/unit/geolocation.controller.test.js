const GeolocationController = require('../../controllers/geolocation.controller.js');
const GeolocationService = require('../../services/geolocation.service.js');
const httpMocks = require('node-mocks-http');

jest.mock('../../services/geolocation.service.js');

let req, res;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
});

describe('Geolocation Controller - Get Action', () => {
  describe('Happy Path', () => {
    const location = {
      location: "New York"
    };

    beforeEach(() => {
      req.body = location;

      GeolocationService.geocode.mockResolvedValue({
        "latitude": 40.68295,
        "longitude": -73.9708,
        "label": "New York, NY, USA"
      })
    });

    it('should have a geocodeHandler function', () => {
      expect(typeof GeolocationController.geocodeHandler).toBe('function');
    });

    it('should call GeolocationService.geocode', async () => {
      await GeolocationController.geocodeHandler(req, res);

      expect(GeolocationService.geocode).toHaveBeenCalledWith(location.location);
    });

    it('should return a 200 status code', async () => {
      await GeolocationController.geocodeHandler(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it('should return a JSON body in response', async () => {
      await GeolocationController.geocodeHandler(req, res);

      expect(res._getJSONData()).toStrictEqual({
        "latitude": 40.68295,
        "longitude": -73.9708,
        "label": "New York, NY, USA"
      });
    });
  });

  describe('Sad Path', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return a 422 status code when location is missing', async () => {
      req.body = {};

      await GeolocationController.geocodeHandler(req, res);

      expect(res.statusCode).toBe(422);
      expect(res._isEndCalled()).toBeTruthy();
      expect(res._getJSONData()).toStrictEqual({
        message: 'All fields are required'
      });
    });

    it('should return a 404 status code when location is not found', async () => {
      req.body = { location: "abc123abc123" };
      GeolocationService.geocode.mockRejectedValue({ message: 'NO_RESULTS' })

      await GeolocationController.geocodeHandler(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._isEndCalled()).toBeTruthy();
      expect(res._getJSONData()).toStrictEqual({
        message: 'Location not found'
      });
    });

    it('should return a 502 status code when geocode api fails', async () => {
      req.body = { location: "New York" };
      GeolocationService.geocode.mockRejectedValue({ message: 'GEOCODE_API_ERROR' });

      await GeolocationController.geocodeHandler(req, res);

      expect(res.statusCode).toBe(502);
      expect(res._isEndCalled()).toBeTruthy();
      expect(res._getJSONData()).toStrictEqual({
        message: 'Geocoding service error'
      });
    });

    it('should return a 50 status code for a server error', async () => {
      req.body = { location: "New York" };
      GeolocationService.geocode.mockRejectedValue({ message: 'GEOCODE_FETCH_FAILED' });

      await GeolocationController.geocodeHandler(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._isEndCalled()).toBeTruthy();
      expect(res._getJSONData()).toStrictEqual({
        message: 'Internal server error'
      });
    });

  });
})