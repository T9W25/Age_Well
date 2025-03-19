require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/vitalsRoutes"));

app.listen(process.env.PORT, () => console.log(`🚀 Server running on port ${process.env.PORT}`));
