const mongoose = require("mongoose");

const EmergencyContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  relationship: { type: String, required: true },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["elderly", "caregiver", "healthcare", "family", "admin"],
    required: true
  },

  // ✅ Health Info
  age: Number,
  height: String,      // e.g., "170 cm"
  weight: String,      // e.g., "70 kg"
  bloodType: String,   // e.g., "O+"
  allergies: String,   // comma-separated input string
  medicalConditions: String, // comma-separated input string
  profilePicture: String,

  vitals: {
    heartRate: String,
    bloodPressure: String,
    bloodSugar: String,
    glucoseLevel: String
  },

  emergencyContacts: [EmergencyContactSchema],
  assignedElderly: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  assignedFamilyMember: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("User", UserSchema);
