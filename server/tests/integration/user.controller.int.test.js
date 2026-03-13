const request = require('supertest');
const app = require('../../app');
const expectCookies = require('supertest/lib/cookies');

const endpointUrl = '/api/v1/user';

describe(endpointUrl, () => {
  it('POST ' + endpointUrl, async () => {
    const newUser = {
      username: `testuser_${Date.now()}`,
      password: 'Password123!',
      email: `test_${Date.now()}@example.com`
    };

    const response = await request(app)
      .post(endpointUrl)
      .send(newUser);

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('User created successfully');
    expect(response.body.userId).toBeDefined();
  });

  it('should return 409 if username already exists', async () => {
    const dupUser = {
      username: 'test-user',
      password: 'Password',
      email: 'test@example.com'
    };

    const response = await request(app)
      .post(endpointUrl)
      .send(dupUser);

    expect(response.statusCode).toBe(409);
    expect(response.body.message).toBe('Username or email already exists');
  });

  it('should return 422 if fields are missing', async () => {
    const response = await request(app)
      .post(endpointUrl)
      .send({
        username: 'testuser'
      });
    expect(response.statusCode).toBe(422);
    expect(response.body.message).toBe('All fields are required');
  });
})