const UserController = require('../../controllers/user.controller');
const UserService = require('../../services/user.service');
const httpMocks = require('node-mocks-http');

jest.mock('../../services/user.service.js');

let req, res;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
});