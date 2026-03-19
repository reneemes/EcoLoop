const recycleService = require('../services/recycle.service');

async function getRecycleHistory(req, res) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const userId = req.user.userId;
    const response = await recycleService.index(userId);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to retrieve recycle history' });
  }
}

async function createRecycleHistory(req, res) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { item_type, item_name, quantity, recycled_at } = req.body;
    const userId = req.user.userId;
    const response = recycleService.create(userId, item_type, item_name, quantity, recycled_at);

    return res.status(201).json({response, message: 'Save successful!'});
  } catch (error) {
    return res.status(500).json({ message: 'Failed to save recycle history' });
  }
}

module.exports = {
  getRecycleHistory,
  createRecycleHistory,
}