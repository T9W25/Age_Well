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

// Get assigned elderly for family
router.get("/family/assigned", verifyToken, async (req, res) => {
  try {
    const elderly = await User.findOne({ assignedFamilyMember: req.user.id }).select("-password");
    if (!elderly) return res.status(404).json({ message: "No connected elderly found" });
    res.json(elderly);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Family sends request to elderly
router.post("/request-family/:elderlyId", verifyToken, async (req, res) => {
  try {
    const elderly = await User.findById(req.params.elderlyId);
    if (!elderly) return res.status(404).json({ message: "Elderly not found" });

    if (elderly.pendingFamilyRequests?.includes(req.user.id)) {
      return res.status(400).json({ message: "Request already sent." });
    }

    elderly.pendingFamilyRequests.push(req.user.id);
    await elderly.save();
    res.json({ message: "Family request sent." });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Elderly accepts/rejects
// Family sends request to elderly
router.post("/request-family/:elderlyId", verifyToken, async (req, res) => {
  try {
    // ✅ Ensure only family members can send the request
    if (req.user.role !== "family") {
      return res.status(403).json({ message: "Only family members can send requests." });
    }

    const elderly = await User.findById(req.params.elderlyId);
    if (!elderly || elderly.role !== "elderly") {
      return res.status(404).json({ message: "Elderly user not found." });
    }

    // ✅ Prevent duplicate requests using ObjectId-safe comparison
    const alreadyRequested = elderly.pendingFamilyRequests?.some(
      (id) => id.toString() === req.user.id
    );
    if (alreadyRequested) {
      return res.status(400).json({ message: "Request already sent." });
    }

    elderly.pendingFamilyRequests = elderly.pendingFamilyRequests || [];
    elderly.pendingFamilyRequests.push(req.user.id);
    await elderly.save();

    res.status(200).json({ message: "Family request sent." });
  } catch (err) {
    console.error("❌ Error sending family request:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Elderly sees pending requests
router.get("/pending-family-requests", verifyToken, async (req, res) => {
  try {
    const elderly = await User.findById(req.user.id).populate("pendingFamilyRequests", "name email");
    if (!elderly) return res.status(404).json({ message: "Elderly user not found" });
    res.json(elderly.pendingFamilyRequests);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
