const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// ✅ Load environment variables
dotenv.config();
console.log("✅ MONGO URI Loaded:", process.env.MONGO_URI ? "Yes" : "No");

const conferenceCaptionsRoutes = require("./routes/conferenceCaptions");

const app = express();

app.use(express.json());
app.use(cors());

// ✅ Test to confirm .env is working
console.log("✅ Cohere Key Loaded:", process.env.COHERE_API_KEY ? "Yes" : "No");

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// ✅ Routes
app.use("/api/conference-captions", conferenceCaptionsRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
