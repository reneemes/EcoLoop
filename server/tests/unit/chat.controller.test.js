const ChatController = require('../../controllers/chat.controller');
const ChatService = require('../../services/chat.service');
const { formatPrompt } = require('../../utils/prompt');
const httpMocks = require('node-mocks-http');

jest.mock('../../services/chat.service');
jest.mock('../../utils/prompt');

describe('Chat Controller - Create Response', () => {
  let req, res;
  describe('Happy Path', () => {
    beforeEach(() => {
      req = httpMocks.createRequest({
        body: {item: 'soda bottle'}
      });
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

    it('should return a 201 response code', async () => {
      ChatService.create.mockResolvedValue('mock response');
      await ChatController.createResponse(req, res);
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toStrictEqual('mock response');
    })
    
    it('should return an answer to the prompt', async () => {
      ChatService.create.mockResolvedValue('mock response');
      await ChatController.createResponse(req, res);
      expect(res._getJSONData()).toStrictEqual('mock response');
    });
  });

  describe('Sad Path',  () => {

    beforeEach(() => {
      req = httpMocks.createRequest();
      res = httpMocks.createResponse();

      jest.clearAllMocks();
    });

    it('should return a 500 for server errors', async () => {
      req.body = { item: 'soda bottle' };
      ChatService.create.mockRejectedValue(new Error('Server error'));

      await ChatController.createResponse(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toStrictEqual({
        message: 'Failed to generate a response'
      });
    });

    it('should return 400 if item is missing', async () => {
    req.body = {};

    await ChatController.createResponse(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual({
      message: 'Missing required field: item'
    });
  });

  it('should return 500 if service returns nothing', async () => {
    req.body = { item: 'soda bottle' };
    ChatService.create.mockResolvedValue(undefined);

    await ChatController.createResponse(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toStrictEqual({
      message: 'No response generated'
    });
  });

  });
})

describe('Chat Controller - Save Response', () => {
  describe('Happy Path', () => {
    const userId = '99';

    beforeEach(() => {
      req = httpMocks.createRequest({
        user: { userId },
        body: {
          item: 'soda bottle',
          chat: 'generated response'
        }
      });

      res = httpMocks.createResponse();
      jest.clearAllMocks();
    });

    it('should have a saveResponse function', () => {
      expect(typeof ChatController.saveResponse).toBe('function');
    });

    it('should call ChatService.save', async () => {
      await ChatController.saveResponse(req, res);
      expect(ChatService.save)
      .toHaveBeenCalledWith(userId, req.body.item, req.body.chat);
    });

    it('should return a 201 status code', async() => {
      await ChatController.saveResponse(req, res);
      expect(res.statusCode).toBe(201);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it('should return a JSON response', async () => {
      ChatService.save.mockResolvedValue();
      await ChatController.saveResponse(req, res);
      expect(res._getJSONData()).toStrictEqual({
        message: "Search history saved"
      });
    });

  })

  describe('Sad Path', () => {
    beforeEach(() => {
      req = httpMocks.createRequest();
      res = httpMocks.createResponse();

      jest.clearAllMocks();
    });

    it('should return 500 if the service throws an error', async () => {
      const errorMessage = 'DB failure';

      req.user = { userId: '99' };
      req.body = {
        item: 'soda bottle',
        chat: 'AI response'
      };

      ChatService.save.mockRejectedValue(new Error(errorMessage));

      await ChatController.saveResponse(req, res);

      expect(ChatService.save).toHaveBeenCalled();
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toStrictEqual({
        message: "Failed to save to database"
      });
    });

    it('should handle missing body fields', async () => {
      req.user = { userId: '99' };
      req.body = {};

      ChatService.save.mockRejectedValue(new Error('Invalid data'));

      await ChatController.saveResponse(req, res);

      expect(ChatService.save).toHaveBeenCalledWith('99', undefined, undefined);
      expect(res.statusCode).toBe(500);
    });

    it('should return 401 if user is missing', async () => {
      req.body = {
        item: 'soda bottle',
        chat: 'AI response'
      };

      await ChatController.saveResponse(req, res);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData()).toStrictEqual({
        message: 'Not authenticated'
      });
    });
  })
})

describe('Chat Controller - Delete Response', () => {
  describe('Happy Path', () => {
    beforeEach(() => {
      req = httpMocks.createRequest();
      res = httpMocks.createResponse();

      req.user = { userId: '99' };
      req.body = {
        id: 123
      };
      
      jest.clearAllMocks();
    });

    it('should have a deleteResponse function', () => {
      expect(typeof ChatController.deleteResponse).toBe('function');
    });

    it('should call ChatService.destroy', async () => {
      await ChatController.deleteResponse(req, res);
      expect(ChatService.destroy)
      .toHaveBeenCalledWith(req.body.id, req.user.userId);
    });

    it('should return a 204 status code', async() => {
      ChatService.destroy.mockResolvedValue({ affectedRows: 1 });

      await ChatController.deleteResponse(req, res);
      expect(res.statusCode).toBe(204);
      expect(res._isEndCalled()).toBeTruthy();
    });
  })

  describe('Sad Path', () => {
    beforeEach(() => {
      req = httpMocks.createRequest();
      res = httpMocks.createResponse();
      jest.clearAllMocks();
    });

    it('should return 401 if the user is not authenticated', async () => {
      req.body = { id: 123 };

      await ChatController.deleteResponse(req, res);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData()).toStrictEqual({
        message: "Not authenticated"
      });
    });

    it('should return 404 if the search history is not found', async () => {
      req.user = { userId: '99' };
      req.body = { id: 123 };

      ChatService.destroy.mockResolvedValue({ affectedRows: 0 });

      await ChatController.deleteResponse(req, res);

      expect(ChatService.destroy).toHaveBeenCalledWith(123, '99');
      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toStrictEqual({
        message: 'Search history not found'
      });
    });

    it('should return 500 if the service throws an error', async () => {
      req.user = { userId: '99' };
      req.body = { id: 123 };

      ChatService.destroy.mockRejectedValue(new Error('DB failure'));

      await ChatController.deleteResponse(req, res);

      expect(ChatService.destroy).toHaveBeenCalledWith(123, '99');
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toStrictEqual({
        message: 'failed to delete database entry'
      });
    });

    it('should return 404 if no id is provided in the body', async () => {
      req.user = { userId: '99' };
      req.body = {};

      ChatService.destroy.mockResolvedValue({ affectedRows: 0 });

      await ChatController.deleteResponse(req, res);

      expect(ChatService.destroy).toHaveBeenCalledWith(undefined, '99');
      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toStrictEqual({
        message: 'Search history not found'
      });
    });
  })
})