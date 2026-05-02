const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "NO_TOKEN",
    });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "INVALID_TOKEN_FORMAT",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch full user from database to ensure email and other data are current
    const user = await User.findById(decoded.id);
    if (!user) {
        return res.status(401).json({ error: "USER_NOT_FOUND" });
    }
    
    req.user = user; 
   
    next();
  } catch (err) {
    return res.status(401).json({
      error: "TOKEN_INVALID_OR_EXPIRED",
    });
  }
};

module.exports = authMiddleware;
