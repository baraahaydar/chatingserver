const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();
require("dotenv").config();
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(express.static("images"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.disable("x-powered-by");
const path = require("path");
app.use("/pdf-qr", express.static(path.join(__dirname, "/images/qrpdf")));
mongoose.connect(process.env.DB_LOCAL_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(con => {
  console.log(`MongoDB Database is connected successfully with host: ${con.connection.host}`);
}).catch(err => console.log("DB Connection Error", err));
const classesRoutes = require("./routes/classesRoutes");
const authRoute = require("./routes/usersRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
const studentRoutes = require("./routes/studentRoutes");
const groupsRoutes = require("./routes/groupsRoutes");
const classStudentRoutes = require("./routes/classStudentsRoutes");
const classInstructorRoutes = require("./routes/classInstructorRoutes");
const materialRoutes = require("./routes/materialRoutes");
const materialClassRoutes = require("./routes/materialClassRoutes");
const mailRoutes = require("./routes/mailRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
app.use("/classes", classesRoutes);
app.use("/auth", authRoute);
app.use("/instructors", instructorRoutes);
app.use("/students", studentRoutes);
app.use("/groups", groupsRoutes);
app.use("/classStudents", classStudentRoutes);
app.use("/classInstructors", classInstructorRoutes);
app.use("/materials", materialRoutes);
app.use("/classMaterials", materialClassRoutes);
app.use("/mail", mailRoutes);
app.use("/chats", chatRoutes);
app.use("/messages", messageRoutes);
const port = process.env.PORT || 4000;
const socketIO = require("socket.io");
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Set up the WebSocket connection
const setupWebSocket = require("./websocket");
setupWebSocket(server);