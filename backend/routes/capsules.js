const express = require("express");
const router = express.Router();
const Capsule = require("../models/capsule");
const User = require("../models/user");
const upload = require("../config/multer"); // Import Multer config

// Middleware to ensure user is logged in
const isAuthenticated = (req, res, next) => {
    console.log("Session userId:", req.session.userId);
    if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    next();
};

router.post("/create", isAuthenticated, upload.single("media"), async (req, res) => {
    try {
        console.log("Request body:", req.body);
        console.log("Request file:", req.file);

        const { title, content, releaseDate } = req.body;
        const file = req.file;

        // Validate required fields
        if (!title || !content || !releaseDate) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Get user from session
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        // Prepare capsule data
        const capsuleData = {
            title,
            content,
            releaseDate: new Date(releaseDate), // Convert string to Date
            userId: user._id,
            userEmail: user.email, // Use user's email from DB
        };

        if (file) {
            // Store file locally (adjust path as needed)
            const mediaPath = `/uploads/${file.filename}`;
            capsuleData.media = mediaPath;
        }

        // Save capsule to MongoDB
        const newCapsule = new Capsule(capsuleData);
        await newCapsule.save();

        res.status(201).json({ message: "Capsule created successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
});

module.exports = router;