const request = require('supertest');
const app = require('../../app');
const userLogin = require('../mock-data/new-user-session.json');

const endpointUrl = '/api/v1/session';

let mockUser = { userId: 3 };

jest.mock('../../middleware/auth', () => {
  return (req, res, next) => {
    req.user = mockUser;
    next();
  };
});

describe(endpointUrl, () => {
  it('GET ' + endpointUrl, async () => {
    mockUser = { userId: 3 };

    const response = await request(app)
      .get(endpointUrl);

    expect(response.statusCode).toBe(200);
    expect(response.body.user.id).toBe(3);
    expect(response.body.user.username).toBe('test-user');
    expect(response.body.user.email).toBe('test@example.com');
  });

  it('should return 401 if user is not authenticated', async () => {
    mockUser = undefined;

    const response = await request(app)
      .get(endpointUrl);

    expect(response.statusCode).toBe(401);
    expect(response.body).toStrictEqual({
      message: 'Not authenticated'
    });
  });

  it('should return 401 if userId is missing', async () => {
    mockUser = {};
    const response = await request(app)
      .get(endpointUrl);

    expect(response.statusCode).toBe(401);
  });

  it('should return 401 if the user does not exist', async () => {
    const response = await request(app)
      .get(endpointUrl);

    expect(response.statusCode).toBe(401);
    expect(response.body).toStrictEqual({
      message: 'Not authenticated'
    });
  });

  it('should return 500 if the user does not exist in the database', async () => {
    mockUser = { userId: 99 };
    const response = await request(app)
      .get(endpointUrl);

    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({
      message: 'Failed to fetch user'
    });
  });
})

describe(endpointUrl, () => {
  it('POST ' + endpointUrl, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .send(userLogin);

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Sign in successful');
    expect(response.body.user.username).toBe(userLogin.username);
    expect(response.body.user.email).toBe(userLogin.email);
  });

  it('should return error 401 on malformed username' + endpointUrl, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .send({ username: 'username', password: 'Password' });

    expect(response.statusCode).toBe(401);
    expect(response.body).toStrictEqual({"message": "Invalid credentials"});
  });

  it('should return error 500 on malformed password' + endpointUrl, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .send({ username: 'test-user', password: '000000000' });

    expect(response.statusCode).toBe(401);
    expect(response.body).toStrictEqual({"message": "Invalid credentials"});
  });
})