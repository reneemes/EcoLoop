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

async function saveResponse(req, res) {
  const userId = req.user.userId;

  try {
    const { item, chat } = req.body;

    const response = await chatService.save(userId, item, chat);

    res.status(201).json({
      message: 'Search history saved',
      response
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'failed to save to database' });
  }
}

module.exports = {
  createResponse,
  saveResponse,
}