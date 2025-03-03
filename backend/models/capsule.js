const mongoose = require("mongoose");

const capsuleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to user
    userEmail: { type: String, required: true }, // Store user's email from User model
    media: { type: String }, // Store file path/URL (e.g., for images/videos)
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Capsule", capsuleSchema);