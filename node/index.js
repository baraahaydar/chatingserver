const express = require("express");
const app = express(); //
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();

app.use(express.json()); //  This is an alternative for body parser
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
  })
);

// connect to mongoDB
mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },

  (err) => {
    if (err) return console.error(err);
    console.log("Connected to MongoDB");
  }
);

// set up routes
//An endpoint request:
app.get("/test", (req, res) => {
  res.send("It works");
});

app.get("/", (req, res) => {
  res.send("main page");
});

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

app.use("/chats", chatRoutes);
app.use("/messages", messageRoutes);
app.use("/auth", authRoutes);

const port = process.env.PORT || 4000;
const httpServer = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Set up the WebSocket connection
const setupWebSocket = require("./websocket");
setupWebSocket(httpServer);
