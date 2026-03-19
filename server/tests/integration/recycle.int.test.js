const request = require('supertest');
const app = require('../../app');
const RecycleService = require('../../services/recycle.service');

const endpointUrl = '/api/v1/recycle';

let mockUser = { userId: 3 };

jest.mock('../../services/recycle.service');
jest.mock('../../middleware/auth', () => {
  return (req, res, next) => {
    req.user = mockUser;
    next();
  };
});

describe(endpointUrl, () => {
  describe('GET ' + endpointUrl, () => {
    it('should return 200 status code and recycle history', async () => {
      mockUser = { userId: 3 };
      const mockResponse = [
        { id: 1, item_type: 'plastic', item_name: 'soda bottle', quantity: 5, recycled_at: '2026-03-19' },
      ];
      RecycleService.index.mockResolvedValue(mockResponse);

      const response = await request(app).get(endpointUrl);

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual(mockResponse);
    });

    it('should return 401 if user is not authenticated', async () => {
      mockUser = undefined;

      const response = await request(app).get(endpointUrl);

      expect(response.statusCode).toBe(401);
      expect(response.body).toStrictEqual({
        message: 'Not authenticated'
      });
    });

    it('should return 500 if service throws an error', async () => {
      mockUser = { userId: 3 };

      RecycleService.index.mockRejectedValue(new Error('DB failure'));

      const response = await request(app).get(endpointUrl);

      expect(response.statusCode).toBe(500);
      expect(response.body).toStrictEqual({
        message: 'Failed to retrieve recycle history'
      });
    });

  })

  describe('POST ' + endpointUrl, () => {
    it('should return 201 and create a new recycle history entry', async () => {
      mockUser = { userId: 3 };

      const response = await request(app)
        .post(endpointUrl)
        .send({
          item_type: 'plastic',
          item_name: 'soda bottle',
          quantity: 5,
          recycled_at: '2026-03-19'
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe('Save successful!');
    });

    it('should return 401 if user is not authenticated', async () => {
      mockUser = undefined;

      const response = await request(app)
        .post(endpointUrl)
        .send({
          item_type: 'plastic',
          item_name: 'soda bottle',
          quantity: 5,
          recycled_at: '2026-03-19'
        });

      expect(response.statusCode).toBe(401);
      expect(response.body).toStrictEqual({
        message: 'Not authenticated'
      });
    });

    it('should return 500 if saving fails', async () => {
      mockUser = { userId: 99999 };

      RecycleService.create.mockRejectedValue(new Error('DB failure'));

      const response = await request(app)
        .post(endpointUrl)
        .send({
          item_type: 'plastic',
          item_name: 'soda bottle',
          quantity: 5,
          recycled_at: '2026-03-19'
        });

      expect(response.statusCode).toBe(500);
      expect(response.body).toStrictEqual({
        message: 'Failed to save recycle history'
      });
    });

  })
})