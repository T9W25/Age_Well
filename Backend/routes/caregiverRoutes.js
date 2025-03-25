const express = require("express");
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Ensure only caregivers can access this
const verifyCaregiver = (req, res, next) => {
  if (!req.user || req.user.role !== "caregiver") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

// ✅ Search for Elderly Users (Caregiver & Healthcare)
router.get("/search-elderly", verifyToken, async (req, res) => {
  try {
    const { query } = req.query; // Search by name or email
    const elderlyUsers = await User.find({
      role: "elderly",
      $or: [{ name: new RegExp(query, "i") }, { email: new RegExp(query, "i") }],
    });

    res.json(elderlyUsers);
  } catch (error) {
    console.error("❌ Error searching elderly users:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Caregiver Adds an Elderly Client
router.put("/add-elderly/:caregiverId", verifyToken, verifyCaregiver, async (req, res) => {
  try {
    const { caregiverId } = req.params;
    const { elderlyId } = req.body;

    const caregiver = await User.findById(caregiverId);
    const elderly = await User.findById(elderlyId);

    if (!caregiver || caregiver.role !== "caregiver") {
      return res.status(400).json({ message: "Caregiver not found" });
    }
    if (!elderly || elderly.role !== "elderly") {
      return res.status(400).json({ message: "Elderly user not found" });
    }

    // Prevent duplicate addition
    if (caregiver.assignedElderly.includes(elderlyId)) {
      return res.status(400).json({ message: "Elderly user already assigned" });
    }

    caregiver.assignedElderly.push(elderlyId);
    await caregiver.save();

    res.json({ message: "Elderly user added!", caregiver });
  } catch (error) {
    console.error("❌ Error adding elderly user:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get Elderly Users Assigned to Caregiver
router.get("/my-elderly", verifyToken, verifyCaregiver, async (req, res) => {
  try {
    const caregiver = await User.findById(req.user.id).populate("assignedElderly");

    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver not found" });
    }

    res.json(caregiver.assignedElderly);
  } catch (error) {
    console.error("❌ Error fetching assigned elderly users:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
