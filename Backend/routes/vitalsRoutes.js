const express = require("express");
const router = express.Router();
const Vitals = require("../models/Vitals");
const verifyToken = require("../middleware/authMiddleware");

// ✅ GET user vitals
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const vitals = await Vitals.findOne({ userId: req.params.userId });
    if (!vitals) return res.status(404).json({ message: "Vitals not found" });
    res.json(vitals);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ UPDATE user vitals
router.put("/:userId", verifyToken, async (req, res) => {
  try {
    const updatedVitals = await Vitals.findOneAndUpdate(
      { userId: req.params.userId },
      { $set: req.body.vitals },
      { new: true, upsert: true }
    );

    res.json({ message: "Vitals updated successfully!", updatedVitals });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
