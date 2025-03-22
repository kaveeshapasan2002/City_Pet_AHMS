const User=require("../models/User");
const jwt=require("jsonwebtoken");//used to generate jwt token for authentication
const bcrypt = require("bcryptjs");//handles password hashing and comparison
const asyncHandler = require("express-async-handler"); //A wrapper function to handle async errors without using try-catch blocks.

exports.registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role, phonenumber } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }  
    const user = await User.create({ name, email, password, role,phonenumber });
    if (user) {
        res.status(201).json({
          _id: user.id,
          name: user.name,
          email: user.email,
          phonenumber: user.phonenumber,  // 
          role: user.role,
          token: generateToken(user._id),
        });
      } else {
        res.status(400).json({ message: "Invalid user data" });
      }
    });
    exports.loginUser = asyncHandler(async (req, res) => {
        const { email, password } = req.body;
          
        const user = await User.findOne({ email });
        if (user && (await user.comparePassword(password))) {

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
              phonenumber: user.phonenumber,
                role: user.role,
                token: generateToken(user._id),
              });
            } else {
              res.status(401).json({ message: "Invalid email or password" });
            }
          });
          const generateToken = (id) => {
            return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
          };
                    
          //create branch
          