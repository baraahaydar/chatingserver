const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ errorMessage: "Unauthenticated Request" });
    }

    const decodedToken = jwt.verify(token, process.env.APP_JWT_SECRET_KEY);
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(404).json({ errorMessage: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ errorMessage: "Unauthenticated Request" });
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ errorMessage: "Unauthorized User" });
    }
    next();
  };
};
