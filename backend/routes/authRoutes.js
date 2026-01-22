const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Update import to use the object with functions
const { sendEmail, sendOtpEmail } = require("../utils/emailService");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, phonenumber, role } = req.body;

        // Validate request body
        if (!name || !email || !password || !phonenumber || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate role
        const validRoles = ["Pet Owner", "Admin", "Veterinarian", "Receptionist"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role value" });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 mins

        // Create new user - password will be hashed in the pre-save hook
        user = new User({
            name,
            email,
            password,
            phonenumber,
            role,
            otp,
            otpExpires,
            isVerified: false,
            isActive: true // Make sure new users are active by default
        });

        await user.save();

        // Send OTP via email using the updated email service
        try {
            await sendOtpEmail(email, otp, name);
            res.status(201).json({ message: "OTP sent to email. Please verify your account." });
        } catch (emailError) {
            console.error("Failed to send OTP email:", emailError.message);
            // Registration successful even if email fails
            res.status(201).json({ 
                message: "Registration successful! Email service unavailable. Please contact support to verify your account.",
                warning: "Email not sent - email service configuration issue"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify user OTP & activate account
router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "User already verified" });
        }

        if (user.otp !== otp || user.otpExpires < new Date()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Verify the user
        user.isVerified = true;
        user.otp = undefined; // Remove OTP
        user.otpExpires = undefined;
        await user.save();

        // Generate JWT Token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ message: "Account verified successfully!", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const MAX_FAILED_ATTEMPTS = 5;
        const LOCK_TIME_MINUTES = 10;

        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            console.log("❌ User not found:", email);
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // Compare passwords FIRST - this is the most likely point of failure
        const isMatch = await user.comparePassword(password);
        console.log("Password Match:", isMatch);
        

        // Handle failed login
        if (!isMatch) {
            // Initialize properties if they don't exist
            if (typeof user.failedLoginAttempts !== 'number') {
                user.failedLoginAttempts = 0;
            }
            if (typeof user.accountLocked !== 'boolean') {
                user.accountLocked = false;
            }

            // Increment failed attempts
            user.failedLoginAttempts += 1;
            user.lastLoginAttempt = new Date();

            // Add to login history if it exists
            if (Array.isArray(user.loginHistory)) {
                user.loginHistory.push({
                    date: new Date(),
                    status: 'failed',
                    ipAddress: req.ip || "unknown"
                });
            }
            // Check if account should be locked
            if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
                user.accountLocked = true;
                user.accountLockedUntil = new Date(Date.now() + LOCK_TIME_MINUTES * 60 * 1000);
            }

            // Save the user document
            await user.save();
                    
            // Return appropriate response
            if (user.accountLocked) {
                return res.status(403).json({
                    message: `Account locked due to multiple failed login attempts. Try again in ${LOCK_TIME_MINUTES} minutes.`
                });
            } else {
                return res.status(400).json({ 
                    message: "Invalid credentials",
                    attemptsRemaining: MAX_FAILED_ATTEMPTS - user.failedLoginAttempts
                });
            }
        }

        // If we get here, login succeeded

        // Check if account is locked
        if (user.accountLocked && user.accountLockedUntil > new Date()) {
            const remainingTime = Math.ceil((user.accountLockedUntil - new Date()) / (1000 * 60));
            return res.status(403).json({
                message: `Account locked due to multiple failed login attempts. Try again in ${remainingTime} minutes.`
            });
        }

        // Verify email is verified
        if (!user.isVerified) {
            return res.status(400).json({ message: "Please verify your email before logging in" });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({ message: "Your account has been deactivated. Please contact an administrator." });
        }

        // Reset failed attempts on successful login
        user.failedLoginAttempts = 0;
        user.accountLocked = false;
        user.accountLockedUntil = null;
        user.lastLoginAttempt = new Date();

        // Add to login history if it exists
        if (Array.isArray(user.loginHistory)) {
            user.loginHistory.push({
                date: new Date(),
                status: 'success',
                ipAddress: req.ip || "unknown"
            });
        }

        await user.save();
                
        // Generate JWT Token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
                
        res.json({ token, user });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email with OTP
// @access  Public
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        // Validate request body
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 mins

        // Save OTP to user
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        // Send OTP via email
        try {
            await sendOtpEmail(email, otp, user.name, "Password Reset");
            res.status(200).json({ message: "Password reset OTP sent to your email" });
        } catch (emailError) {
            console.error("Email sending error:", emailError);
            // Since email service is not working, return OTP in response (DEVELOPMENT ONLY)
            console.log(`⚠️  OTP for ${email}: ${otp}`);
            res.status(200).json({ 
                message: "Email service unavailable. OTP logged to server console.",
                warning: "Please check server logs for OTP or contact support",
                // Remove this in production:
                devOtp: otp
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   POST /api/auth/verify-reset-otp
// @desc    Verify OTP for password reset
// @access  Public
router.post("/verify-reset-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Validate request body
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.otp !== otp || user.otpExpires < new Date()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Generate a temporary token for password reset
        const resetToken = jwt.sign({ id: user.id, purpose: 'reset' }, process.env.JWT_SECRET, {
            expiresIn: "15m", // Short expiration time for security
        });

        res.status(200).json({ message: "OTP verified successfully", resetToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   POST /api/auth/reset-password
// @desc    Reset user password
// @access  Public (with reset token)
router.post("/reset-password", async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        // Validate request body
        if (!resetToken || !newPassword) {
            return res.status(400).json({ message: "Reset token and new password are required" });
        }

        // Verify token
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        
        // Check if token is for password reset
        if (decoded.purpose !== 'reset') {
            return res.status(401).json({ message: "Invalid reset token" });
        }

        // Find user
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update password - will be hashed by pre-save hook
        user.password = newPassword;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   PUT /api/auth/edit-profile
// @desc    Edit user profile (Pet Owner & Veterinarian)
// @access  Private
router.put("/edit-profile", authMiddleware, async (req, res) => {
    try {
        const { name, phonenumber, profilePicture, specialization, licenseNumber } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: "User not found" });

        user.name = name || user.name;
        user.phonenumber = phonenumber || user.phonenumber;
        user.profilePicture = profilePicture || user.profilePicture;

        if (user.role === "Veterinarian") {
            user.specialization = specialization || user.specialization;
            user.licenseNumber = licenseNumber || user.licenseNumber;
        }

        await user.save();
        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put("/change-password", authMiddleware, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) return res.status(400).json({ message: "Incorrect old password" });

        user.password = newPassword; // Password will be hashed by pre-save hook
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// @route   POST /api/auth/add-pet
// @desc    Add pet details (Only Pet Owners)
// @access  Private
router.post("/add-pet", authMiddleware, async (req, res) => {
    try {
        const { name, species, breed, age, medicalHistory } = req.body;
        const user = await User.findById(req.user.id);

        if (!user || user.role !== "Pet Owner") {
            return res.status(403).json({ message: "Not authorized" });
        }

        user.pets.push({ name, species, breed, age, medicalHistory });
        await user.save();

        res.json({ message: "Pet added successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// @route   GET /api/auth/user
// @desc    Get authenticated user
// @access  Private
router.get("/user", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;