const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: String,
  uses: String,
  dosageGuidelines: String,
  commonSideEffects: [String],
  warnings: [String],
  embedding: [Number]
});

module.exports = mongoose.model("Medicine", medicineSchema);