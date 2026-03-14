const chatService = require('../services/chat.service');
const { formatPrompt } = require('../utils/prompt.js');

async function createResponse(req, res) {
  try {
    const { item } = req.body;

    const prompt = formatPrompt(item);
    const response = await chatService.create(prompt);

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate a response' });
  }
}

module.exports = {
  createResponse,
}