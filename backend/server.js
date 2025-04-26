const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const router1 = require("./routes/PetRoute");
const router2 = require("./routes/MediRoute");
const router = require("./routes/AppointmentRoute");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

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


// Add to existing routes
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



// Add other routes here as you build them
// app.use("/api/appointments", require("./routes/appointmentRoutes"));
// app.use("/api/medical-records", require("./routes/medicalRecordRoutes"));

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

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`.yellow.bold);
});