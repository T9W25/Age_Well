const cron = require("node-cron");
const Prescription = require("../models/Prescription");
const User = require("../models/User");

// ✅ Function to send notifications (For now, just log them)
const sendNotification = (user, prescription) => {
  console.log(`🔔 Reminder for ${user.name}: Take ${prescription.medicationName} (${prescription.dosage}) at ${prescription.time}`);

  // TODO: Send email, SMS, or push notification
};

// ✅ Scheduler: Runs every minute to check reminders
cron.schedule("* * * * *", async () => {
  console.log("🔄 Checking for medication reminders...");

  const now = new Date();
  const currentTime = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  const currentDay = now.toLocaleString("en-US", { weekday: "long" });

  const prescriptions = await Prescription.find({ time: currentTime, days: currentDay });

  for (const prescription of prescriptions) {
    const user = await User.findById(prescription.userId);
    if (user) sendNotification(user, prescription);
  }
});

module.exports = cron;
