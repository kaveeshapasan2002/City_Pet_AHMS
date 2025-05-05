// File: /backend/controllers/adminController.js

const User = require("../models/User");
const Boarding = require("../models/Boarding");
// Import any other models you might need

// @route   GET /api/admin/user-stats
// @desc    Get user statistics by role
// @access  Private/Admin
exports.getUserStats = async (req, res) => {
  try {
    // Get count of users by role
    const userCounts = await User.aggregate([
      { $match: { isActive: true } }, // Only count active users
      { $group: { _id: "$role", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Format the results into a more user-friendly structure
    const stats = {
      totalUsers: 0,
      roles: {}
    };

    userCounts.forEach(item => {
      stats.totalUsers += item.count;
      stats.roles[item._id] = item.count;
    });

    // Ensure all roles are represented even if count is 0
    const allRoles = ["Admin", "Veterinarian", "Receptionist", "Pet Owner"];
    allRoles.forEach(role => {
      if (!stats.roles[role]) {
        stats.roles[role] = 0;
      }
    });

    res.json(stats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Add any other admin controller functions you have directly from your adminRoutes.js file
// For example, if you have functions implemented directly in the routes file, move them here

// If you have this in your routes file, move the implementation here
exports.getUsers = async (req, res) => {
  try {
    const { search, role, status } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (role && role !== "All") {
      filter.role = role;
    }
    
    if (status) {
      filter.isActive = status === "Active";
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phonenumber: { $regex: search, $options: "i" } }
      ];
    }
    
    const users = await User.find(filter)
      .select("-password -otp -otpExpires")
      .sort({ createdAt: -1 });
      
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Add all other admin controller functions here based on what you have in your routes
// For example: toggleUserStatus, deleteUser, addUser, changeUserRole, etc.

//add admincontroller.js for get stats


