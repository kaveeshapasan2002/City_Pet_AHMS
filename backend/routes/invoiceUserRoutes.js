// routes/invoiceUserRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get pet owners with filtering options (by phonenumber, email, etc.)
router.get("/petowners", async (req, res) => {
  try {
    const { phonenumber, email, name } = req.query;
    let query = { role: "Pet Owner" }; // Always filter for Pet Owners
    
    // Add additional filters if provided
    if (phonenumber) {
      // Create flexible phone number matching
      // This allows matching regardless of leading zeros
      const phoneWithoutLeadingZeros = phonenumber.replace(/^0+/, '');
      
      // Use $or to try multiple phone formats
      query = {
        ...query,
        $or: [
          { phonenumber: phonenumber },                  // Exact match
          { phonenumber: `0${phonenumber}` },           // With leading zero
          { phonenumber: phoneWithoutLeadingZeros },    // Without leading zeros
          // Add regex for more flexible matching if needed
          { phonenumber: { $regex: phoneWithoutLeadingZeros + '$' } }  // Ends with the digits
        ]
      };
    }
    
    if (email) query.email = email;
    if (name) query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    
    console.log("User search query:", JSON.stringify(query, null, 2));
    
    const users = await User.find(query)
      .select("-password -loginHistory -failedLoginAttempts")
      .sort({ name: 1 });
    
    console.log(`Found ${users.length} users matching the query`);
    
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user by ID (for invoice verification)
router.get("/verify/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("_id name email phonenumber role");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;