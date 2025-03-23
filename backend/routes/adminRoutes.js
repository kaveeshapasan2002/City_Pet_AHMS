const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const emailService = require("../utils/emailService");


const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// @route   GET /api/admin/users
// @desc    Get all users with optional filtering
// @access  Private/Admin
router.get("/users", async (req, res) => {
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
  });
  // @route   PUT /api/admin/users/:id/toggle-status
// @desc    Toggle user active status
// @access  Private/Admin
router.put("/users/:id/toggle-status", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Prevent deactivating self
      if (user._id.toString() === req.user.id) {
        return res.status(400).json({ message: "You cannot deactivate your own account" });
      }
      
      // Toggle status
      user.isActive = !user.isActive;
      await user.save();
      
      // Send notification email
      const subject = user.isActive 
        ? "Your account has been activated" 
        : "Your account has been deactivated";
        
      const text = user.isActive
        ? `Hello ${user.name},\n\nYour account on the Pet Hospital system has been activated. You can now log in to access your account.\n\nRegards,\nPet Hospital Team`
        : `Hello ${user.name},\n\nYour account on the Pet Hospital system has been deactivated. Please contact the administrator for more information.\n\nRegards,\nPet Hospital Team`;
      
      // Handle email sending safely
    try {
      // Check which email function you have available
      if (typeof emailService.sendEmail === 'function') {
        await emailService.sendEmail(user.email, subject, text);
      } else if (typeof emailService === 'function') {
        await emailService(user.email, subject, text);
      } else {
        console.error("Email service function not found");
      }
    } catch (emailError) {
      console.error("Failed to send status notification email:", emailError);
      // Continue with the response - don't fail the status change if email fails
    }
      
      res.json({ 
        message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`, 
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive
        } 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  });
  

// Add this route to your adminRoutes.js file

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
// @access  Private/Admin
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Prevent deleting self
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }
    
    // Prevent deleting another admin (optional security measure)
    if (user.role === "Admin" && req.user.role === "Admin") {
      return res.status(400).json({ message: "Admin accounts can only be deleted by super administrators" });
    }
    
    // Delete the user
    await User.findByIdAndDelete(req.params.id);
    
    // Send notification email
    try {
      const subject = "Your account has been removed";
      const text = `Hello ${user.name},\n\nYour account on the Pet Hospital system has been removed by an administrator. If you believe this is an error, please contact us.\n\nRegards,\nPet Hospital Team`;
      
      // Check which email function is available
      if (typeof emailService.sendEmail === 'function') {
        await emailService.sendEmail(user.email, subject, text);
      } else if (typeof emailService === 'function') {
        await emailService(user.email, subject, text);
      }
    } catch (emailError) {
      console.error("Failed to send account deletion email:", emailError);
      // Continue with the response - don't fail the deletion if email fails
    }
    
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


// @route   POST /api/admin/users
// @desc    Add a new user (admin only)
// @access  Private/Admin
router.post("/users", async (req, res) => {
  try {
    const { name, email, password, phonenumber, role, isActive } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phonenumber || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    // Check if the phone number is already in use
    const existingPhone = await User.findOne({ phonenumber });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number is already in use" });
    }

    // Validate role
    const validRoles = ["Admin", "Veterinarian", "Pet Owner", "Receptionist"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Create the user
    const newUser = new User({
      name,
      email,
      password, // Will be hashed by pre-save hook
      phonenumber,
      role,
      isActive: isActive !== undefined ? isActive : true,
      isVerified: true, // Admin-created accounts are auto-verified
    });

    await newUser.save();

    // Send welcome email
    try {
      const subject = "Your account has been created";
      const text = `Hello ${name},\n\nAn administrator has created an account for you on the Pet Hospital system.\n\nYour login details are:\nEmail: ${email}\nPassword: ${password}\n\nPlease change your password after your first login for security.\n\nRegards,\nPet Hospital Team`;
      
      // Check which email function is available
      if (typeof emailService.sendEmail === 'function') {
        await emailService.sendEmail(email, subject, text);
      } else if (typeof emailService === 'function') {
        await emailService(email, subject, text);
      }
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Continue with the response - don't fail the user creation if email fails
    }

    // Return success without sending password
    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phonenumber: newUser.phonenumber,
        role: newUser.role,
        isActive: newUser.isActive,
        isVerified: newUser.isVerified
      }
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server Error" });
  }
});



// adminRoutes.js - Add these routes

// @route   PUT /api/admin/users/:id/role
// @desc    Change user role
// @access  Private/Admin
router.put("/users/:id/role", async (req, res) => {
  try {
    const { role, reason } = req.body;
    
    // Validate role
    const validRoles = ["Admin", "Veterinarian", "Receptionist", "Pet Owner"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Prevent changing own role (optional security measure)
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: "You cannot change your own role" });
    }
    
    // Store previous role for history
    const previousRole = user.role;
    
    // Update role
    user.role = role;
    
    // Add to role history
    user.roleHistory.push({
      previousRole,
      newRole: role,
      changedBy: req.user.id,
      reason: reason || "Role changed by administrator"
    });
    
    // Apply default permissions based on new role
    user.permissions = getDefaultPermissions(role);
    
    await user.save();
    
    // Notify user via email
    try {
      const subject = "Your account role has been updated";
      const text = `Hello ${user.name},\n\nYour role in the Pet Hospital system has been updated from ${previousRole} to ${role}.\n\nIf you have any questions about this change, please contact an administrator.\n\nRegards,\nPet Hospital Team`;
      
      await emailService.sendEmail(user.email, subject, text);
    } catch (emailError) {
      console.error("Failed to send role change email:", emailError);
    }
    
    res.json({ 
      message: "User role updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   PUT /api/admin/users/:id/permissions
// @desc    Update user permissions
// @access  Private/Admin
router.put("/users/:id/permissions", async (req, res) => {
  try {
    const { permissions } = req.body;
    
    if (!Array.isArray(permissions)) {
      return res.status(400).json({ message: "Permissions must be an array" });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Update permissions
    user.permissions = permissions;
    await user.save();
    
    res.json({ 
      message: "User permissions updated successfully",
      permissions: user.permissions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Helper function to get default permissions for each role
function getDefaultPermissions(role) {
  switch (role) {
    case "Admin":
      return [
        "manage_users", "view_all_records", "manage_appointments",
        "manage_settings", "generate_reports", "view_analytics"
      ];
    case "Veterinarian":
      return [
        "view_patient_records", "update_medical_records", 
        "manage_appointments", "view_own_schedule"
      ];
    case "Receptionist":
      return [
        "view_appointments", "schedule_appointments", 
        "register_patients", "view_patient_basic_info"
      ];
    case "Pet Owner":
      return [
        "view_own_pets", "view_own_appointments", 
        "book_appointments", "update_own_profile"
      ];
    default:
      return [];
  }
}

// @route   GET /api/admin/security-logs
// @desc    Get security logs for users
// @access  Private/Admin
router.get("/security-logs", async (req, res) => {
  try {
    const users = await User.find({})
      .select('name email role failedLoginAttempts accountLocked accountLockedUntil lastLoginAttempt')
      .sort({ failedLoginAttempts: -1, lastLoginAttempt: -1 });
    
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


// @route   PUT /api/admin/users/:id/unlock
// @desc    Unlock a user account
// @access  Private/Admin
router.put("/users/:id/unlock", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Reset security fields
    user.failedLoginAttempts = 0;
    user.accountLocked = false;
    user.accountLockedUntil = null;
    
    await user.save();
    
    res.json({ 
      message: "Account unlocked successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        failedLoginAttempts: user.failedLoginAttempts,
        accountLocked: user.accountLocked
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});










module.exports = router;



  
  