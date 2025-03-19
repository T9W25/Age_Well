const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  vitals: {
    heartRate: Number,
    bloodSugar: String,
    bloodPressure: String,
    glucoseLevel: String,
  },
});

module.exports = mongoose.model("User", UserSchema);
