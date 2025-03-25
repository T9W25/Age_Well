const express = require("express");
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Middleware to Ensure Admin Access
const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// ✅ Get All Users (Admin View)
router.get("/users", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Approve or Reject User Accounts
router.put("/users/:userId/status", verifyToken, verifyAdmin, async (req, res) => {
  const { status } = req.body;
  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status update." });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { status },
      { new: true }
    ).select("-password");

    res.json({ message: `User ${status}!`, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Reassign Elderly User to a Different Caregiver
router.put("/reassign-elderly", verifyToken, verifyAdmin, async (req, res) => {
  const { elderlyId, newCaregiverId } = req.body;

  try {
    // Remove elderly from previous caregiver
    await User.updateMany({}, { $pull: { assignedElderly: elderlyId } });

    // Assign to the new caregiver
    await User.findByIdAndUpdate(newCaregiverId, {
      $push: { assignedElderly: elderlyId },
    });

    res.json({ message: "Elderly user reassigned successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
