const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");

// ✅ Assign elderly to caregiver
router.put("/assign-elderly/:caregiverId", verifyToken, async (req, res) => {
  try {
    const { elderlyId } = req.body;

    // Only caregiver or admin should be able to assign
    if (!["caregiver", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const caregiver = await User.findById(req.params.caregiverId);
    const elderly = await User.findById(elderlyId);

    if (!caregiver || caregiver.role !== "caregiver") {
      return res.status(404).json({ message: "Caregiver not found or invalid" });
    }

    if (!elderly || elderly.role !== "elderly") {
      return res.status(404).json({ message: "Elderly user not found or invalid" });
    }

    // Avoid duplicates
    if (!caregiver.assignedElderly.includes(elderlyId)) {
      caregiver.assignedElderly.push(elderlyId);
      await caregiver.save();
    }

    res.status(200).json({ message: "Elderly assigned to caregiver successfully" });
  } catch (error) {
    console.error("❌ Error assigning elderly:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Update user info
// PUT /api/users/:id - Update user health info
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const userIdFromToken = req.user.id; // ✅ Use 'id' from token payload
    const targetUserId = req.params.id;
    const updates = req.body;

    // ✅ Allow only self-update or admin/healthcare
    if (
      userIdFromToken !== targetUserId &&
      !["admin", "healthcare"].includes(req.user.role)
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // ✅ Optional: Validate known fields (add/remove as needed)
    const allowedFields = [
      "name", "age", "height", "weight", "bloodType",
      "allergies", "medicalConditions", "profilePicture",
      "vitals.heartRate", "vitals.bloodPressure",
      "vitals.bloodSugar", "vitals.glucoseLevel"
    ];

    // Build update object
    const updateObject = {};

    for (const field of allowedFields) {
      const [parent, child] = field.split(".");
      if (child) {
        // nested (e.g. vitals.heartRate)
        if (!updateObject[parent]) updateObject[parent] = {};
        if (req.body[parent] && req.body[parent][child] !== undefined) {
          updateObject[parent][child] = req.body[parent][child];
        }
      } else {
        if (updates[field] !== undefined) {
          updateObject[field] = updates[field];
        }
      }
    }

    const updatedUser = await User.findByIdAndUpdate(targetUserId, updateObject, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
