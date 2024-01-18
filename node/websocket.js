const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const Message = require("./models/messageModel");
const Chat = require("./models/chatModel");
const path = require("path");
const fs = require("fs").promises;

function setupWebSocket(httpServer) {
  const wss = new WebSocket.Server({ server: httpServer });

  const onlineUsers = new Map();

  wss.on("connection", (socket) => {
    socket.on("message", async (data) => {
      try {
        const messageData = JSON.parse(data);
        const { type, userId, payload } = messageData;

        if (type === "login") {
          handleLogin(socket, userId);
        } else if (type === "chatMessage") {
          handleChatMessage(payload);
        } else if (type === "newChat") {
          handleNewChat(payload);
        } else if (type === "messageHistoryRequest") {
          handleMessageHistoryRequest(socket, payload);
        } else if (type === "typing") {
          handleTyping(payload);
        } else if (type === "checkUserStatus") {
          handleCheckUserStatus(socket, payload);
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    });

    socket.on("close", () => {
      const userId = getKeyByValue(onlineUsers, socket);

      if (userId) {
        onlineUsers.delete(userId);
        // Send a message to all clients to update the user's online status to false
        broadcastMessage({
          type: "userStatusUpdate",
          payload: { userId, status: false },
        });
      }
    });
  });

  async function handleLogin(socket, userId) {
    if (!userId) {
      return;
    }

    try {
      socket.userId = userId;
      onlineUsers.set(userId, socket);
      // Send a message to all clients to update the user's online status to true
      broadcastMessage({
        type: "userStatusUpdate",
        payload: { userId, status: true },
      });
    } catch (error) {
      console.error("Error handling login:", error);
    }
  }

  async function handleChatMessage(messageData) {
    try {
      const { senderId, receiverId, chatId, content, file, isVoice } =
        messageData;
      const senderSocket = onlineUsers.get(senderId);
      const receiverSocket = onlineUsers.get(receiverId);

      if (!file || file === null) {
        const message = new Message({
          senderId,
          receiverId,
          chatId,
          content,
          isVoice,
          file: "",
        });

        const savedMessage = await message.save();
        if (senderSocket) {
          senderSocket.send(
            JSON.stringify({ type: "chatMessage", payload: savedMessage })
          );
        }

        if (receiverSocket) {
          receiverSocket.send(
            JSON.stringify({ type: "chatMessage", payload: savedMessage })
          );
        }
      } else {
        if (senderSocket) {
          // message is being sent without file data fix it
          senderSocket.send(
            JSON.stringify({ type: "chatMessage", payload: messageData })
          );
        }

        if (receiverSocket) {
          receiverSocket.send(
            JSON.stringify({ type: "chatMessage", payload: messageData })
          );
        }
      }
    } catch (error) {
      console.error("Error handling chat message:", error);
    }
  }

  async function saveFile(fileData) {
    const file = fileData.file;
    const extension = path.extname(fileData.originalname);
    const filename = `${fileData.filename}-${Date.now()}${extension}`;
    const filePath = path.join(process.cwd(), "uploads", filename);

    await fs.writeFile(filePath, file);

    return filePath;
  }

  async function handleNewChat(chatData) {
    try {
      const { userIds, chatTitle, chatType } = chatData;

      const chat = new Chat({ userIds, chatTitle, chatType });
      const savedChat = await chat.save();

      userIds.forEach((userId) => {
        const socket = onlineUsers.get(userId.id);

        if (socket) {
          socket.send(
            JSON.stringify({ type: "newChatCreated", payload: savedChat })
          );
          socket.send(
            JSON.stringify({ type: "chatListUpdate", payload: savedChat._id })
          );
        }
      });
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  }

  async function handleMessageHistoryRequest(socket, requestData) {
    try {
      const { chatId, chatType } = requestData;

      let messages;

      if (chatType === "user") {
        messages = await Message.find({
          $or: [{ chatId }, { senderId: chatId }, { receiverId: chatId }],
        });
      } else if (chatType === "group") {
        messages = await Message.find({ chatId });
      }

      if (messages && messages.length > 0) {
        socket.send(
          JSON.stringify({ type: "messageHistoryResponse", payload: messages })
        );
      }
    } catch (error) {
      console.error("Error retrieving message history:", error);
    }
  }

  async function handleTyping(typingData) {
    const { chatId, userId, receiverId } = typingData;
    const socket = onlineUsers.get(receiverId);
    if (socket) {
      socket.send(
        JSON.stringify({
          type: "typing",
          payload: typingData,
        })
      );
    }
  }

  async function handleCheckUserStatus(socket, payload) {
    const { userId } = payload;
    const isOnline = onlineUsers.has(userId);

    socket.send(
      JSON.stringify({
        type: "userStatusUpdate",
        payload: { userId, status: isOnline },
      })
    );
  }

  async function broadcastMessage(messageData) {
    const messageString = JSON.stringify(messageData);

    for (const socket of onlineUsers.values()) {
      socket.send(messageString);
    }
  }

  async function getKeyByValue(map, value) {
    for (const [key, val] of map.entries()) {
      if (val === value) {
        return key;
      }
    }
  }
}

module.exports = setupWebSocket;
