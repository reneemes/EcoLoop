const request = require('supertest');
const app = require('../../app');
const { GoogleGenAI } = require("@google/genai");
const ChatService = require('../../services/chat.service');

const endpointUrl = '/api/v1/chat';

let mockUser = { userId: 3 };

// jest.mock('../../services/chat.service');
jest.mock('@google/genai');
jest.mock('../../middleware/auth', () => {
  return (req, res, next) => {
    req.user = mockUser;
    next();
  };
});

describe(endpointUrl, () => {
  it('POST ' + endpointUrl, async () => {
    mockUser = { userId: 3 };
    const mockResponse = 'mock response';

    GoogleGenAI.mockImplementation(() => ({
      models: {
        generateContent: jest.fn().mockResolvedValue({
          text: mockResponse
        })
      }
    }));

    const response = await request(app)
      .post(endpointUrl)
      .send({ item: 'soda bottle' });

    expect(response.statusCode).toBe(201);
    expect(response.body).toBe(mockResponse);
  });

  it('should return 400 if item is missing', async () => {
    mockUser = { userId: 3 };

    const response = await request(app)
      .post(endpointUrl)
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      message: 'Missing required field: item'
    });
  });

  it('should return 500 if AI generation fails', async () => {
    mockUser = { userId: 3 };

    const response = await request(app)
      .post(endpointUrl)

    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({
      message: 'Failed to generate a response'
    });
  });

  it('should throw when Gemini fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    GoogleGenAI.mockImplementation(() => ({
      models: {
        generateContent: jest.fn().mockRejectedValue(new Error("Gemini error"))
      }
    }));

    await expect(ChatService.create("hello"))
      .rejects
      .toThrow("Response generation failed");

    console.error.mockRestore();
  });

});