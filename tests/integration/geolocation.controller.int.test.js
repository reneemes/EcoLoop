const request = require('supertest');
const express = require('express');
const axios = require('axios');

const { geocodeHandler } = require('../../controllers/geolocation.controller');

jest.mock('axios');

const app = express();
app.use(express.json());
app.post('/geocode', geocodeHandler);

describe('Geolocation Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /geocode', () => {
    it('should return 200 with geocoded data', async () => {
      axios.get.mockResolvedValue({
        data: {
          data: [
            {
              latitude: 40.68295,
              longitude: -73.9708,
              label: 'New York, NY, USA',
            },
          ],
        },
      });

      const res = await request(app)
        .post('/geocode')
        .send({ location: 'New York' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        latitude: 40.68295,
        longitude: -73.9708,
        label: 'New York, NY, USA',
      });

      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    it('should return 422 if location is missing', async () => {
      const res = await request(app)
        .post('/geocode')
        .send({});

      expect(res.status).toBe(422);
      expect(res.body).toEqual({
        message: 'All fields are required',
      });

      expect(axios.get).not.toHaveBeenCalled();
    });

    it('should return 404 when no results found', async () => {
      axios.get.mockResolvedValue({
        data: {
          data: [],
        },
      });

      const res = await request(app)
        .post('/geocode')
        .send({ location: 'asdasdasd' });

      expect(res.status).toBe(404);
    });

    it('should return 502 when API responds with error', async () => {
      axios.get.mockRejectedValue({
        response: { status: 500 },
      });

      const res = await request(app)
        .post('/geocode')
        .send({ location: 'New York' });

      expect(res.status).toBe(502);
      expect(res.body).toEqual({
        message: 'Geocoding service error',
      });
    });

    it('should return 500 for unknown errors', async () => {
      axios.get.mockRejectedValue(new Error('Random failure'));

      const res = await request(app)
        .post('/geocode')
        .send({ location: 'New York' });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        message: 'Internal server error',
      });
    });
  });
});