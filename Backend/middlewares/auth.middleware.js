const jwt = require("jsonwebtoken");
require("dotenv").config();

// ✅ Verify JWT Token Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. Token missing or malformed." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded payload (id, email, role) to request
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

// ✅ Role-Based Authorization Middleware
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "Access denied. You don't have permission for this action.",
      });
    }

    next(); // User is authorized
  };
};

// ✅ Export both middlewares
module.exports = {
  verifyToken,
  authorizeRoles,
};