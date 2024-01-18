const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const multer = require("multer");
const path = require("path");

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    const timestamp = Date.now();
    const extension = path.extname(originalname);
    const filename = `${originalname}-${timestamp}${extension}`;
    cb(null, filename);
  },
});

// Create a multer upload instance
const upload = multer({ storage });

// Serve static files from the "uploads" directory
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Define message routes
router.get("/", messageController.getAllMessages);
router.get("/:messageId", messageController.getMessageById);
router.get("/chat/:chatId", messageController.getMessageByChatId);

// Handle file upload
router.post("/", upload.single("file"), messageController.createMessage);

// Download file
router.get("/download/:filename", messageController.downloadFile);

module.exports = router;
