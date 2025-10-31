const mongoose = require("mongoose");

const captionSchema = new mongoose.Schema({
  theme: String,
  audience: String,
  date: String,
  location: String,
  speakers: String,
  tone: String,
  captions: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Caption", captionSchema);
