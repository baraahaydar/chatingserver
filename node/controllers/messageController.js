const Message = require("../models/messageModel");
const fs = require("fs");
const path = require("path");

// Get all messages for a specific chat
const getAllMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chatId });
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a specific message by its ID
const getMessageById = async (req, res) => {
  const { messageId } = req.params;
  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.json(message);
  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all messages for a specific chat
const getMessageByChatId = async (req, res) => {
  const { chatId } = req.params;
  try {
    const messages = await Message.find({ chatId });

    if (!messages) {
      return res.status(404).json({ error: "Messages not found" });
    }

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create a new message
const createMessage = async (req, res) => {
  const { senderId, receiverId, chatId, content,isVoice } = req.body;
  let file = null;

  if (req.file) {
    const { filename, originalname, mimetype, size, path } = req.file;
    file = { filename, originalname, mimetype, size, path };
  }

  try {
    const message = await Message.create({
      senderId,
      receiverId,
      chatId,
      content,
      file,
      isVoice
    });

    res.status(201).json(message);
  } catch (error) {
    // Remove the file if an error occurred
    if (file && file.path) {
      fs.unlinkSync(file.path);
    }

    console.error("Error creating message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const downloadFile = (req, res) => {
  const { filename } = req.params;
  const file = path.join(__dirname, `../uploads/${filename}`);
  res.download(file);
};

module.exports = {
  getAllMessages,
  getMessageById,
  getMessageByChatId,
  createMessage,
  downloadFile,
};
