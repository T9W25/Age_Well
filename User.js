const mongoose = require("mongoose");

const VitalsSchema = new mongoose.Schema({
  heartRate: Number,
  bloodSugar: String,
  bloodPressure: String,
  glucoseLevel: String,
  recordedAt: { type: Date, default: Date.now } // ✅ Timestamp for tracking history
});

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  profilePicture: { type: String, default: "" }, // ✅ Profile image support
  age: Number,
  height: String,
  weight: String,
  bloodType: String,
  allergies: [String],
  medicalConditions: [String],
  vitals: [VitalsSchema], // ✅ Store vitals over time for tracking
});

module.exports = mongoose.model("User", UserSchema);
