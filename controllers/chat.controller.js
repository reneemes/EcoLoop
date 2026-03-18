const chatService = require('../services/chat.service');
const { formatPrompt } = require('../utils/prompt.js');

async function getResponses(req, res) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const userId = req.user.userId;
    const response = await chatService.index(userId)

    if (!response || response.length === 0) {
      return res.status(404).json({ message: 'Search history not found' });
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to retrieve search history' });
  }
}

async function createResponse(req, res) {
  try {
    const { item } = req.body;

    if (!item) {
      return res.status(400).json({ message: 'Missing required field: item' });
    }

    const prompt = formatPrompt(item);
    const response = await chatService.create(prompt);

    if (!response) {
      return res.status(500).json({ message: 'No response generated' });
    }

    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to generate a response' });
  }
}

async function saveResponse(req, res) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const userId = req.user.userId;
    const { item, chat } = req.body;

    const response = await chatService.save(userId, item, chat);

    return res.status(201).json({
      message: 'Search history saved',
      response
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to save to database' });
  }
}

async function deleteResponse(req, res) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const userId = req.user.userId;
    const { id } = req.body;
    
    const response = await chatService.destroy(id, userId);

    if (!response.affectedRows) {
      return res.status(404).json({ message: 'Search history not found' });
    }
    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete database entry' });
  }
}

module.exports = {
  getResponses,
  createResponse,
  saveResponse,
  deleteResponse,
}