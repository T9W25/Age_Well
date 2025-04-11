const mongoose = require("mongoose");

const PrescriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Healthcare Professional
  medicationName: { type: String, required: true },
  dosage: { type: String, required: true },
  time: { type: String, required: true }, // "08:00 AM"
  days: [{ type: String }], // ["Monday", "Wednesday", "Friday"]
  notificationMethod: { type: String, enum: ["email", "sms", "web"], default: "web" }, 
});

module.exports = mongoose.model("Prescription", PrescriptionSchema);
