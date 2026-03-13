const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const httpMocks = require('node-mocks-http');

jest.mock('jsonwebtoken');

let req, res, next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('Auth Middleware', () => {
  it('should return 401 if token is missing', () => {
    req.cookies = {};

    auth(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toStrictEqual({ message: "Unauthorized" });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next and attach user if token is valid', () => {
    req.cookies = { token: 'validToken' };

    jwt.verify.mockReturnValue({ id: 3 });

    auth(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(
      'validToken',
      process.env.JWT_SECRET
    );

    expect(req.user).toStrictEqual({ userId: 3 });
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', () => {
    req.cookies = { token: 'badToken' };

    jwt.verify.mockImplementation(() => {
      throw new Error('invalid token');
    });

    auth(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toStrictEqual({ message: "Invalid token" });
    expect(next).not.toHaveBeenCalled();
  });

});