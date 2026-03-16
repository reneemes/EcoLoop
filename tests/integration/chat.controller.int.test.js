const request = require('supertest');
const app = require('../../app');

const endpointUrl = '/api/v1/chat';

let mockUser = { userId: 3 };

// jest.mock('@google/genai', () => {
//   return {
//     GoogleGenAI: jest.fn().mockImplementation(() => {
//       return {
//         models: {
//           generateContent: jest.fn().mockResolvedValue({
//             text: () => 'Mock AI response'
//           })
//         }
//       };
//     })
//   };
// });

jest.mock('../../middleware/auth', () => {
  return (req, res, next) => {
    req.user = mockUser;
    next();
  };
});

describe(endpointUrl, () => {

  // ------------------------------
  // CREATE RESPONSE
  // ------------------------------
  it('POST ' + endpointUrl, async () => {
    mockUser = { userId: 3 };

    const response = await request(app)
      .post(endpointUrl)
      .send({ item: 'soda bottle' });

    expect(response.statusCode).toBe(201);
  expect(response.body).toBe('Mock AI response');
  });

  it('should return 400 if item is missing', async () => {
    mockUser = { userId: 3 };

    const response = await request(app)
      .post(endpointUrl)
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      message: 'Missing required field: item'
    });
  });

  it('should return 500 if AI generation fails', async () => {
    mockUser = { userId: 3 };

    const response = await request(app)
      .post(endpointUrl)
      .send({ item: 'trigger-error' });

    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({
      message: 'Failed to generate a response'
    });
  });

});

describe(endpointUrl + '/save', () => {

  it('POST ' + endpointUrl + '/save', async () => {
    mockUser = { userId: 3 };

    const response = await request(app)
      .post(endpointUrl + '/save')
      .send({
        item: 'soda bottle',
        chat: 'AI response'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Search history saved');
  });

  it('should return 401 if user is not authenticated', async () => {
    mockUser = undefined;

    const response = await request(app)
      .post(endpointUrl + '/save')
      .send({
        item: 'soda bottle',
        chat: 'AI response'
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toStrictEqual({
      message: 'Not authenticated'
    });
  });

  it('should return 500 if saving fails', async () => {
    mockUser = { userId: 99999 }; // user that doesn't exist

    const response = await request(app)
      .post(endpointUrl + '/save')
      .send({
        item: 'soda bottle',
        chat: 'AI response'
      });

    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({
      message: 'Failed to save to database'
    });
  });

});

describe(endpointUrl, () => {

  // ------------------------------
  // DELETE RESPONSE
  // ------------------------------
  it('DELETE ' + endpointUrl, async () => {
    mockUser = { userId: 3 };

    const response = await request(app)
      .delete(endpointUrl)
      .send({ id: 1 });

    expect(response.statusCode).toBe(204);
  });

  it('should return 401 if user is not authenticated', async () => {
    mockUser = undefined;

    const response = await request(app)
      .delete(endpointUrl)
      .send({ id: 1 });

    expect(response.statusCode).toBe(401);
    expect(response.body).toStrictEqual({
      message: 'Not authenticated'
    });
  });

  it('should return 404 if search history does not exist', async () => {
    mockUser = { userId: 3 };

    const response = await request(app)
      .delete(endpointUrl)
      .send({ id: 999999 });

    expect(response.statusCode).toBe(404);
    expect(response.body).toStrictEqual({
      message: 'Search history not found'
    });
  });

  it('should return 500 if deletion fails', async () => {
    mockUser = { userId: 99999 };

    const response = await request(app)
      .delete(endpointUrl)
      .send({ id: 1 });

    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({
      message: 'failed to delete database entry'
    });
  });

});