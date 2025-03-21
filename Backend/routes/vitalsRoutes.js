const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Update Vitals
router.post("/update-vitals", async (req, res) => {
  const { userId, vitals } = req.body;
  await User.findByIdAndUpdate(userId, { vitals });
  res.json({ message: "Vitals updated successfully!" });
});

// Get Vitals
router.get("/vitals/:userId", async (req, res) => {
  const user = await User.findById(req.params.userId);
  res.json(user.vitals);
});

module.exports = router;
