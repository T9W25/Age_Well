const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");

// ✅ Get Emergency Contacts
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("emergencyContacts");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.emergencyContacts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Add Emergency Contact
router.post("/:userId", verifyToken, async (req, res) => {
  try {
    const { name, phone, relationship } = req.body;
    if (!name || !phone || !relationship) return res.status(400).json({ message: "All fields are required" });

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.emergencyContacts.push({ name, phone, relationship });
    await user.save();

    res.status(201).json({ message: "Contact added!", emergencyContacts: user.emergencyContacts });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Emergency Alert Route
router.post("/alert", verifyToken, async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("🚨 Emergency alert sent to:", user.emergencyContacts);
    res.json({ message: "Emergency alert sent!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
