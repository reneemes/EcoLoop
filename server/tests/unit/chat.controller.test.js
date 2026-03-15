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
      req = httpMocks.createRequest();
      res = httpMocks.createResponse();
      
      jest.clearAllMocks();

      // ChatService.create.mockResolvedValue(`
      //   Soda bottles can be recycled, whether they are made of plastic or glass. 
      //   Just make sure to empty any leftover liquid and give the bottle a quick 
      //   rinse before tossing it in your bin. Keeping bottles clean and empty 
      //   ensures they can be easily melted down and turned into brand-new containers!
      // `);
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
      await ChatController.createResponse(req, res);
      expect(res.statusCode).toBe(201);
      expect(res._isEndCalled()).toBeTruthy();
    })
  });

  // it('should return a answer to the prompt', async () => {
  //   {item: 'soda bottle'}
  //   ChatService.create.mockResolvedValue();
  //   await ChatController.createResponse(req, res);
  //   expect(res._getJSONData()).toStrictEqual({
  //     user: { id: 1, username: 'test-user', email: 'user@email.com', role: 0 }
  //   });
  // });

  describe('Sad Path',  () => {

    beforeEach(() => {
      req = httpMocks.createRequest();
      res = httpMocks.createResponse();
    });

    it('should return a 500 for server errors', async () => {
      const errorMessage = 'Server error';
      ChatService.create.mockRejectedValue(new Error(errorMessage));

      await ChatController.createResponse(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toStrictEqual({ message: 'Failed to generate a response' });
    });
  });
})