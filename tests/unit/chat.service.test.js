const ChatService = require('../../services/chat.service');
const createConnection = require('../../db');
const { GoogleGenAI } = require('@google/genai');

jest.mock('../../db');
jest.mock('@google/genai');

describe('ChatService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('index', () => {
    it('should return search history for a user', async () => {
      const mockQuery = jest.fn().mockResolvedValue([
        [{ id: 1, keyword: 'pizza', result: 'NYC pizza' }]
      ]);

      createConnection.mockResolvedValue({
        promise: () => ({
          query: mockQuery
        })
      });

      const result = await ChatService.index(1);
      
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [1]
      );

      expect(result).toEqual([{ id: 1, keyword: 'pizza', result: 'NYC pizza' }]);
    });

    it('should throw if DB fails', async () => {
      createConnection.mockRejectedValue(new Error('DB error'));

      await expect(ChatService.index(1)).rejects.toThrow('DB error');
    });
  });

  describe('create', () => {
    it('should return AI generated response', async () => {
      const mockGenerate = jest.fn().mockResolvedValue({
        text: 'AI response'
      });

      GoogleGenAI.mockImplementation(() => ({
        models: {
          generateContent: mockGenerate
        }
      }));

      const result = await ChatService.create('hello');

      expect(mockGenerate).toHaveBeenCalledWith({
        model: "gemini-3-flash-preview",
        contents: 'hello'
      });

      expect(result).toBe('AI response');
    });

    it('should throw formatted error when AI fails', async () => {
      const mockGenerate = jest.fn().mockRejectedValue(new Error('API fail'));

      GoogleGenAI.mockImplementation(() => ({
        models: {
          generateContent: mockGenerate
        }
      }));

      await expect(ChatService.create('hello'))
        .rejects
        .toThrow('Response generation failed');
    });
  });

  describe('save', () => {
    it('should insert search history', async () => {
      const mockQuery = jest.fn().mockResolvedValue([
        [{ insertId: 1 }]
      ]);

      createConnection.mockResolvedValue({
        promise: () => ({
          query: mockQuery
        })
      });

      const result = await ChatService.save(1, 'pizza', 'result');

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT'),
        [1, 'pizza', 'result']
      );

      expect(result).toEqual({ insertId: 1 });
    });

    it('should throw if insert fails', async () => {
      const mockQuery = jest.fn().mockRejectedValue(new Error('Insert failed'));

      createConnection.mockResolvedValue({
        promise: () => ({
          query: mockQuery
        })
      });

      await expect(
        ChatService.save(1, 'pizza', 'result')
      ).rejects.toThrow('Insert failed');
    });
  });

  describe('destroy', () => {
    it('should delete a record', async () => {
      const mockQuery = jest.fn().mockResolvedValue([
        { affectedRows: 1 }
      ]);

      createConnection.mockResolvedValue({
        promise: () => ({
          query: mockQuery
        })
      });

      const result = await ChatService.destroy(1, 1);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('DELETE'),
        [1, 1]
      );

      expect(result).toEqual({ affectedRows: 1 });
    });

    it('should return 0 affectedRows if nothing deleted', async () => {
      const mockQuery = jest.fn().mockResolvedValue([
        { affectedRows: 0 }
      ]);

      createConnection.mockResolvedValue({
        promise: () => ({
          query: mockQuery
        })
      });

      const result = await ChatService.destroy(999, 1);

      expect(result).toEqual({ affectedRows: 0 });
    });

    it('should throw if delete fails', async () => {
      const mockQuery = jest.fn().mockRejectedValue(new Error('Delete failed'));

      createConnection.mockResolvedValue({
        promise: () => ({
          query: mockQuery
        })
      });

      await expect(
        ChatService.destroy(1, 1)
      ).rejects.toThrow('Delete failed');
    });
  });
});