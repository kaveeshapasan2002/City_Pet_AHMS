// routes/serviceRoutes.js
const express = require("express");
const router = express.Router();
const Service = require("../models/ServiceModel");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all services
router.get("/", async (req, res) => {
  try {
    const services = await Service.find({ active: true });
    res.status(200).json({ services });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get service by ID
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    
    res.status(200).json({ service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new service (admin only)
router.post("/", adminMiddleware, async (req, res) => {
  try {
    const { name, description, cost, category, duration } = req.body;
    
    const newService = new Service({
      name,
      description,
      cost,
      category,
      duration: duration || 30
    });
    
    await newService.save();
    
    res.status(201).json({ 
      message: "Service created successfully", 
      service: newService 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update service (admin only)
router.put("/:id", adminMiddleware, async (req, res) => {
  try {
    const { name, description, cost, category, duration, active } = req.body;
    
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    
    // Update fields
    if (name) service.name = name;
    if (description) service.description = description;
    if (cost !== undefined) service.cost = cost;
    if (category) service.category = category;
    if (duration !== undefined) service.duration = duration;
    if (active !== undefined) service.active = active;
    
    await service.save();
    
    res.status(200).json({ 
      message: "Service updated successfully", 
      service 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete service (admin only) - soft delete by setting active to false
router.delete("/:id", adminMiddleware, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    
    service.active = false;
    await service.save();
    
    res.status(200).json({ message: "Service deactivated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;