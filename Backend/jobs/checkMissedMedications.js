const Prescription = require("../models/Prescription");
const Notification = require("../models/Notification");
const User = require("../models/User");

const checkMissedMedications = async () => {
  const now = new Date();

  // Find medications that were scheduled over 1 hour ago but not taken
  const missedMeds = await Prescription.find({
    taken: false,
    time: { $lte: new Date(now - 60 * 60000) } // 1 hour past due
  }).populate("userId doctorId");

  for (const med of missedMeds) {
    const caregiver = await User.findOne({ role: "caregiver", _id: med.userId.assignedCaregiver });

    if (caregiver) {
      await Notification.create({
        user: caregiver._id,
        message: `🚨 ${med.userId.name} missed their ${med.medicationName}! Check on them.`
      });

      console.log(`🔔 Notification sent to ${caregiver.name} about ${med.userId.name}`);
    }
  }
};

module.exports = checkMissedMedications;
