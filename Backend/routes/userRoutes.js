const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");

// Search users by role and name
router.get("/search", verifyToken, async (req, res) => {
  try {
    const { name = "", role = "elderly" } = req.query;
    const query = {
      role,
      name: { $regex: name, $options: "i" },
    };
    const users = await User.find(query).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Assign elderly to caregiver
router.put("/assign-elderly/:caregiverId", verifyToken, async (req, res) => {
  try {
    const { elderlyId } = req.body;

    if (!["caregiver", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const caregiver = await User.findById(req.params.caregiverId);
    const elderly = await User.findById(elderlyId);

    if (!caregiver || caregiver.role !== "caregiver") {
      return res.status(404).json({ message: "Caregiver not found" });
    }

    if (!elderly || elderly.role !== "elderly") {
      return res.status(404).json({ message: "Elderly user not found" });
    }

    if (!caregiver.assignedElderly.includes(elderlyId)) {
      caregiver.assignedElderly.push(elderlyId);
      await caregiver.save();
    }

    res.json({ message: "Elderly assigned successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get user by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Update user info
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updates = req.body;
    const requesterId = req.user.id;

    if (requesterId !== req.params.id && !["admin", "healthcare"].includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const allowedFields = [
      "name", "email", "age", "height", "weight", "bloodType",
      "allergies", "medicalConditions", "profilePicture",
      "vitals.heartRate", "vitals.bloodPressure", "vitals.bloodSugar", "vitals.glucoseLevel",
      "chronicIllnesses", "medications", "surgeries", "immunizations",
      "diagnosisHistory", "clinicalNotes"
    ];

    const updateObject = {};

    for (const field of allowedFields) {
      const [parent, child] = field.split(".");
      if (child) {
        updateObject[parent] = updateObject[parent] || {};
        if (req.body[parent]?.[child] !== undefined) {
          updateObject[parent][child] = req.body[parent][child];
        }
      } else if (updates[field] !== undefined) {
        updateObject[field] = updates[field];
      }
    }

    const updated = await User.findByIdAndUpdate(req.params.id, updateObject, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Search elderly users
router.get("/search", verifyToken, async (req, res) => {
  try {
    const { name = "", role = "elderly" } = req.query;
    const query = {
      role,
      name: { $regex: name, $options: "i" },
    };
    const users = await User.find(query).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get assigned elderly for family
router.get("/family/assigned", verifyToken, async (req, res) => {
  try {
    const elderly = await User.findOne({ assignedFamilyMember: req.user.id }).select("-password");
    if (!elderly) return res.status(404).json({ message: "No connected elderly found" });
    res.json(elderly);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Family sends request to elderly
router.post("/request-family/:elderlyId", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "family") {
      return res.status(403).json({ message: "Only family members can send requests." });
    }

    const elderly = await User.findById(req.params.elderlyId);
    if (!elderly || elderly.role !== "elderly") {
      return res.status(404).json({ message: "Elderly user not found." });
    }

    const existingNotification = await Notification.findOne({
      userId: elderly._id,
      senderId: req.user.id,
      type: "family_request",
      read: false,
    });

    if (existingNotification) {
      return res.status(400).json({ message: "Request already sent." });
    }

    const senderName = req.user.name || "A family member";

    await Notification.create({
      userId: elderly._id,
      senderId: req.user.id,
      message: `${senderName} is requesting to connect with you as a family member.`,
      type: "family_request",
    });

    res.status(200).json({ message: "Family request sent." });
  } catch (err) {
    console.error("❌ Error sending family request:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Elderly accepts/rejects family request
router.post("/respond-family-request/:notificationId", verifyToken, async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { accept } = req.body;

    const notification = await Notification.findById(notificationId);
    if (!notification || notification.type !== "family_request") {
      return res.status(404).json({ message: "Family request notification not found" });
    }

    const elderly = await User.findById(notification.userId);
    const family = await User.findById(notification.senderId);

    if (!elderly || elderly.role !== "elderly" || !family || family.role !== "family") {
      return res.status(400).json({ message: "Invalid user roles" });
    }

    if (req.user.id !== elderly._id.toString()) {
      return res.status(403).json({ message: "Only the elderly can respond to this request" });
    }

    if (accept) {
      elderly.assignedFamilyMember = family._id;
      await elderly.save();
    }

    await notification.deleteOne();
    res.json({ message: accept ? "Family request accepted." : "Family request rejected." });
  } catch (err) {
    console.error("❌ Error responding to family request:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
