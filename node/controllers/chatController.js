const Chat = require("../models/chatModel");

// Get all chats for a specific user
const getAllChats = async (req, res) => {
  const { userId } = req.params;
  try {
    const chats = await Chat.find({ "userIds.id": userId });
    res.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a specific chat by its ID
const getChatById = async (req, res) => {
  const { chatId } = req.params;
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    res.json(chat);
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create a new chat
const createChat = async (req, res) => {
  const { chatType, userIds, chatTitle } = req.body;
  try {
    const chat = await Chat.create({ chatType, userIds, chatTitle });
    res.status(201).json(chat);
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllChats,
  getChatById,
  createChat,
};
