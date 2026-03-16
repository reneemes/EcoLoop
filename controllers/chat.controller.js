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
    res.status(500).json({ message: 'failed to save to database' });
  }
}

async function deleteResponse(req, res) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const userId = req.user.userId;
    const { id } = req.body;
    
    const response = await chatService.destroy(id, userId);

    if (!response.affectedRows) {
      res.status(404).json({ message: '' });
    }
    console.log(response);
    res.status(204);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'failed to delete database entry' });
  }
}

module.exports = {
  createResponse,
  saveResponse,
  deleteResponse,
}