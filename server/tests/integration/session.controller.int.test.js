const request = require('supertest');
const app = require('../../app');
const userLogin = require('../mock-data/new-user-session.json');

const endpointUrl = '/api/v1/session';

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