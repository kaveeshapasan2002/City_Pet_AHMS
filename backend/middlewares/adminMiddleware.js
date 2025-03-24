/**
 * Middleware to check if user is an admin
 * Must be used after authMiddleware
 */

//I comment it
/* module.exports = function (req, res, next) {
    // Check if user is authenticated and has admin role
    if (!req.user || req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied. Admin access required." });
    }
    
    next();
  }; */