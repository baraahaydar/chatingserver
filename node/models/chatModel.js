const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  chatType: {
    type: String,
  },
  userIds: {
    type: Array,
  },

  chatTitle: {
    type: String,
  },
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
