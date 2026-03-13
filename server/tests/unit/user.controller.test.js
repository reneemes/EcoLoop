const UserController = require('../../controllers/user.controller');
const UserService = require('../../services/user.service');
const httpMocks = require('node-mocks-http');

jest.mock('../../services/user.service.js');

let req, res;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
});

describe('User Controller - Create Action', () => {
  describe('Happy Path', () => {
    const newUser = {
      "username": "newuser",
      "password": "Password123",
      "email": "email@test.com"
    };

    beforeEach(() => {
      req.body = newUser;

      UserService.create.mockResolvedValue({
        insertId: 99
      });
    });

    it('should have a createUser function', () => {
      expect(typeof UserController.createUser).toBe('function');
    });

    it('should call UserService.create', async () => {
      await UserController.createUser(req, res);

      expect(UserService.create).toHaveBeenCalledWith(
        newUser.username,
        newUser.password,
        newUser.email
      );
    });

    it('should return 201 response code', async () => {
      await UserController.createUser(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it('should return a JSON body in response', async () => {
      await UserController.createUser(req, res);

      expect(res._getJSONData()).toStrictEqual({
        message: 'User created successfully',
        userId: 99
      });
    });
  });

  describe('Sad Path', () => {
    const newUser = {
      "username": "newuser",
      "password": "Password123",
      "email": "email@test.com"
    };

    beforeEach(() => {
      req.body = newUser;
    });

    it('should return a 422 when required fields are missing', async () => {
      req.body = {};

      await UserController.createUser(req, res);

      expect(res.statusCode).toBe(422);
      expect(res._isEndCalled()).toBeTruthy();
      expect(res._getJSONData()).toStrictEqual({
        message: 'All fields are required'
      });
    });

    it('should return 409 when username/email already exists', async () => {
      UserService.create.mockRejectedValue({ code: 'ER_DUP_ENTRY' });

      await UserController.createUser(req, res);

      expect(res.statusCode).toBe(409);
      expect(res._isEndCalled()).toBeTruthy();
      expect(res._getJSONData()).toStrictEqual({
        message: 'Username or email already exists'
      });
    });

    it('should return 500 for other server errors', async () => {
      UserService.create.mockRejectedValue(new Error('Database failure'));

      await UserController.createUser(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._isEndCalled()).toBeTruthy();
      expect(res._getJSONData()).toStrictEqual({
        message: 'Server error',
        error: 'Database failure'
      });
    });

  });
});