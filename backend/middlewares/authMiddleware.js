const jwt = require("jsonwebtoken");
const User = require("../models/User"); //


module.exports = async function (req, res, next) {
    // Get token from header
    const authHeader = req.header("Authorization");
    
    // Check if token exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1];
    
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user by id (but don't include password)
        const user = await User.findById(decoded.id).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Check if user account is active
        if (!user.isActive) {
            return res.status(403).json({ message: "Account is inactive. Please contact an administrator." });
        }
        
        // Add user info to request
        req.user = decoded;
        req.user.isActive = user.isActive; // Add isActive to the request user object
        next();
    } catch (error) {
        console.error("Auth middleware error:", error.message);
        res.status(401).json({ message: "Token is not valid" });
    }
};













/*
module.exports = function (req, res, next) {



    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Access Denied" });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};
*/