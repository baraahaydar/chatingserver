const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Define chat routes
router.get('/all/:userId', chatController.getAllChats);
router.get('/:chatId', chatController.getChatById);
router.post('/', chatController.createChat);
// Add more routes as needed

module.exports = router;
