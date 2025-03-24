//I comented

/* const express = require("express");
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
        await sendOtpEmail(email, otp, name);

        res.status(201).json({ message: "OTP sent to email. Please verify your account." });
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

        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            console.log("❌ User not found:", email);
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        if (!user.isVerified) {
            return res.status(400).json({ message: "Please verify your email before logging in" });
        }

        // Check if user account is active
        if (!user.isActive) {
            return res.status(403).json({ message: "Your account has been deactivated. Please contact an administrator." });
        }
       
        // Compare passwords
        const isMatch = await user.comparePassword(password);
        console.log("Password Match:", isMatch);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

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

module.exports = router; */

//aleady coment

/*
const express = require("express");
const User = require("../models/User"); // Make sure User model exists
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const sendEmail = require("../utils/emailService");
const authMiddleware = require("../middlewares/authMiddleware");



const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post("/register", async (req, res) => {
    try {
        const { name, email, password ,phonenumber, role} = req.body;

   // Validate request body
   if (!name || !email || !password || !phonenumber || !role) {
    return res.status(400).json({ message: "All fields are required" });
}

// Validate role
const validRoles = ["Pet Owner", "Admin", "Veterinarian"];
if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role value" });
}

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("🔐 Hashed Password Before Saving:", hashedPassword);


// Generate OTP
const otp = Math.floor(100000 + Math.random() * 900000).toString();
const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 mins


        // Create new user
        user = new User({
            name,
            email,
            password,
            phonenumber,
            role,
            otp,
            otpExpires,
            isVerified: false
        });

        await user.save();

     
        // Send OTP via email
        await sendEmail(email, "Your OTP for Verification", `Your OTP is: ${otp}`);

        res.status(201).json({ message: "OTP sent to email. Please verify your account." });
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

        res.json({ message: "Account verified successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }


        // Generate JWT Token
        const token = jwt.sign({ id:user.id ,role: user.role}, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        try{res.json({ message: "Account verified successfully!", token });
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

        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            console.log("❌ User not found:", email);
            return res.status(400).json({ message: "Invalid credentials" });
        }
        console.log("✅ User found:", user.email);
        console.log("Stored Hash Password:", user.password);
        console.log("Entered Password:", password);


        if (!user.isVerified) {
            return res.status(400).json({ message: "Please verify your email before logging in" });
        }

        // Check if user account is active
        if (!user.isActive) {
            return res.status(403).json({ message: "Your account has been deactivated. Please contact an administrator." });
        }

        // Compare passwords
        const isMatch = await user.comparePassword(password);
        console.log("Password Match:", isMatch);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user.id ,role: user.role}, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ token, user });
    } catch (error) {
        console.error("Server Error:", error);
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

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect old password" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
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



module.exports = router;


*/