const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  extractedText: String,
  simplifiedText: String, // Keep legacy field for compatibility
  simplifiedSummary: String,
  language: {
    type: String,
    default: "English"
  },
  imagePath: String,
  medicines: [
    {
      name: String,
      dosage: String,
      timing: String,
      purpose: String,
      sideEffects: [String],
      warnings: String,
      interactions: String,
      confidenceScore: Number
    }
  ],
  safetyAlerts: [
    {
      type: { type: String }, // e.g., 'interaction', 'overdose', 'duplicate'
      severity: String, // e.g., 'high', 'medium', 'low'
      title: String,
      description: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Prescription", prescriptionSchema);