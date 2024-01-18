const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.post("/create", authController.createUser);
router.get("/users", authController.getUsers);

module.exports = router;
