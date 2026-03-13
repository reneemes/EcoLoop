const ChatController = require('../../controllers/chat.controller');
const ChatService = require('../../services/chat.service');
const { formatPrompt } = require('../../utils/prompt');
const httpMocks = require('node-mocks-http');

jest.mock('../../services/chat.service');
jest.mock('../../utils/prompt');


describe('Chat Controller - Create Response', () => {
  
  let req, res;
  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  
    jest.clearAllMocks();
  });

  it('should have a createResponse function', () => {
    expect(typeof ChatController.createResponse).toBe('function');
  });

  it('should call ChatService.create', async () => {
    await ChatController.createResponse(req, res);
    expect(ChatService.create)
      .toHaveBeenCalledWith(formatPrompt(req.body.item));
  });
})