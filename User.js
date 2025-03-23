const mongoose = require("mongoose");

const EmergencyContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  relationship: { type: String, required: true },
});

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  age: Number,
  height: String,
  weight: String,
  allergies: [String],
  medicalConditions: [String],
  emergencyContacts: [EmergencyContactSchema], // ✅ Supports multiple contacts
  vitals: {
    heartRate: Number,
    bloodSugar: String,
    bloodPressure: String,
    glucoseLevel: String,
  },
});

module.exports = mongoose.model("User", UserSchema);
