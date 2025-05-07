// models/ServiceModel.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ["Consultation", "Treatment", "Surgery", "Vaccination", "Medication", "Other"],
    required: true
  },
  duration: {
    type: Number,  // in minutes
    default: 30
  },
  active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("Service", serviceSchema);