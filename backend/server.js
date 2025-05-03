const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const router1 = require("./routes/PetRoute");
const router2 = require("./routes/MediRoute");
const router = require("./routes/AppointmentRoute");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: Token required'));
    }
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }
    
    // Attach user to socket
    socket.user = user;
    next();
  } catch (error) {
    return next(new Error('Authentication error: Invalid token'));
  }
});

// Socket connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user ? socket.user.name : 'Unknown'} (${socket.id})`.green);
  
  // Join user's own room for receiving messages
  if (socket.user) {
    socket.join(socket.user._id.toString());
  }
  
  // Handle joining a specific conversation
  socket.on('join-conversation', (conversationId) => {
    socket.join(`conversation:${conversationId}`);
    console.log(`${socket.user ? socket.user.name : 'User'} joined conversation: ${conversationId}`);
  });
  
  // Handle leaving a specific conversation
  socket.on('leave-conversation', (conversationId) => {
    socket.leave(`conversation:${conversationId}`);
    console.log(`${socket.user ? socket.user.name : 'User'} left conversation: ${conversationId}`);
  });
  
  // Handle typing indicator
  socket.on('typing', (data) => {
    const { conversationId, isTyping } = data;
    
    // Broadcast typing status to everyone in the conversation except sender
    socket.to(`conversation:${conversationId}`).emit('user-typing', {
      userId: socket.user._id,
      userName: socket.user.name,
      isTyping,
      conversationId
    });
  });
  
  // Handle marking messages as read
  socket.on('mark-read', (data) => {
    const { conversationId } = data;
    
    // Broadcast read status to everyone in the conversation except sender
    socket.to(`conversation:${conversationId}`).emit('messages-read', {
      userId: socket.user ? socket.user._id : null,
      conversationId
    });
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user ? socket.user.name : 'Unknown'}`);
  });
});

// Make io accessible to our routes
app.set('io', io);

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));

// Animal Record routes
app.use("/pets", router1);
app.use("/medies", router2);
app.use("/appointments", router);

// Boarding routes
app.use("/api/boarding", require("./routes/boardingRoutes"));

// Supplier routes - added from the second file
app.use("/api/suppliers", require("./routes/supplierRoutes"));

// Purchase request routes
app.use('/api/purchase-requests', require('./routes/purchaseRequestRoutes'));

// Set security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  next();
});

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));

// Messaging Routes - consolidated to use the same route file
app.use("/api/conversations", require("./routes/messageRoutes"));
app.use("/api", require("./routes/messageRoutes"));
app.use("/api/notifications", require("./routes/messageRoutes"));

// User directory routes for messaging
app.use("/api/users", require("./routes/userDirectoryRoutes"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack.red);
  res.status(500).json({
    message: err.message || "Something went wrong on the server",
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("../frontend/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../", "frontend", "build", "index.html"));
  });
}

// Start server (using http server instead of app for Socket.IO)
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`.yellow.bold);
});