const SessionController = require('../../controllers/session.controller');
const SessionService = require('../../services/session.service');
const userLogin = require('../mock-data/new-user-session.json');
const httpMocks = require('node-mocks-http');

jest.mock('../../services/session.service.js');

let req, res;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
});

describe('Session Controller - Check Session', () => {
  describe('Happy Path', () => {
    const user = {
      id: 1,
      username: 'new-user',
      email: 'user@email.com',
      role: 0
    };

    beforeEach(() => {
      jest.clearAllMocks();

      req.user = { userId: 1 };

      SessionService.show.mockResolvedValue({
        user: { id: 1, username: 'new-user', email: 'user@email.com', role: 0 }
      });
    });

    it('should have a checkSession function', () => {
      expect(typeof SessionController.checkSession).toBe('function');
    });

    it('should call SessionService.show', async () => {
      await SessionController.checkSession(req, res);
      expect(SessionService.show)
        .toHaveBeenCalledWith(req.user.userId);
    });

    it('should return a 200 response code', async () => {
      await SessionController.checkSession(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it('should return a JSON body in response', async () => {
      SessionService.show.mockResolvedValue(user);
      await SessionController.checkSession(req, res);
      expect(res._getJSONData()).toStrictEqual({
        user: { id: 1, username: 'new-user', email: 'user@email.com', role: 0 }
      });
    });
  });

  describe('Sad Path', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      res = httpMocks.createResponse();
    });

    it('should return 401 if req.user is missing', async () => {
      req.user = undefined;
      await SessionController.checkSession(req, res);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData()).toStrictEqual({ message: 'Not authenticated' });
      expect(res._isEndCalled()).toBeTruthy();
    });

    it('should return 401 if SessionService.show returns null', async () => {
      req.user = { userId: 1 };
      SessionService.show.mockResolvedValue(null); 

      await SessionController.checkSession(req, res);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData()).toStrictEqual({ message: 'Not authenticated' });
    });

    it('should return 500 if SessionService.show throws', async () => {
      req.user = { userId: 1 };
      const errorMessage = 'Database error';
      SessionService.show.mockRejectedValue(new Error(errorMessage));

      await SessionController.checkSession(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toStrictEqual({ message: 'Failed to fetch user' });
    });
  });
});

describe('Session Controller - Create Session', () => {
  describe('Happy Path', () => {
    beforeEach(() => {
      jest.clearAllMocks();

      req.body = userLogin;

      SessionService.create.mockResolvedValue({
        token: 'fakeToken',
        user: { id: 1, username: 'new-user' }
      });
    });

    it('should have a createSession function', () => {
      expect(typeof SessionController.createSession).toBe('function');
    });

    it('should call SessionService.create', async () => {
      await SessionController.createSession(req, res);
      expect(SessionService.create)
        .toHaveBeenCalledWith(userLogin.username, userLogin.password);
    });

    it('should return a 201 response code', async () => {
      await SessionController.createSession(req, res);
      expect(res.statusCode).toBe(201);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it('should return a JSON body in response', async () => {
      SessionService.create.mockResolvedValue(userLogin);
      await SessionController.createSession(req, res);
      expect(res._getJSONData()).toStrictEqual({"message": "Sign in successful"});
    });
  });

  describe('Sad Path', () => {
    it('should return 401 when SessionService.create throws', async () => {
      SessionService.create.mockRejectedValue(new Error('Invalid credentials'));
      await SessionController.createSession(req, res);
      expect(res.statusCode).toBe(401);
    });

    it('should return error message in JSON response', async () => {
      const errorMessage = 'Invalid credentials';
      SessionService.create.mockRejectedValue(new Error(errorMessage));
      await SessionController.createSession(req, res);
      expect(res._getJSONData()).toStrictEqual({
        message: errorMessage
      });
    });

    it('should still call SessionService.create with username and password on failure', async () => {
      SessionService.create.mockRejectedValue(new Error('Invalid credentials'));
      await SessionController.createSession(req, res);
      expect(SessionService.create).toHaveBeenCalledWith(
        userLogin.username,
        userLogin.password
      );
    });
  });
});

describe('Session Controller - Logout', () => {
  it('should have a logout function', () => {
    expect(typeof SessionController.logout).toBe('function');
  });

  it('should return a 200 response code', async () => {
    await SessionController.logout(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should return a JSON body in response', async () => {
    await SessionController.logout(req, res);
    expect(res._getJSONData()).toStrictEqual({"message": "Sign out successful"});
  });
});