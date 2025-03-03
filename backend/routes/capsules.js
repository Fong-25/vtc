const express = require("express");
const router = express.Router();
const Capsule = require("../models/capsule");
const User = require("../models/user");

// Middleware to ensure user is logged in
const isAuthenticated = (req, res, next) => {
    console.log("Session userId:", req.session.userId);
    if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    next();
};

router.post("/create", isAuthenticated, async (req, res) => {
    try {
        // Enhanced logging to inspect incoming data
        console.log("Raw request body:", req.body);
        console.log("Parsed body keys:", Object.keys(req.body));
        console.log("Parsed body values:", JSON.stringify(req.body, null, 2));

        const { title, content, releaseDate } = req.body;

        // Validate required fields (trim to handle whitespace)
        if (!title?.trim() || !content?.trim() || !releaseDate) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Get user from session
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        // Validate releaseDate
        const release = new Date(releaseDate);
        if (isNaN(release.getTime())) {
            return res.status(400).json({ error: "Invalid release date" });
        }

        // Prepare capsule data
        const capsuleData = {
            title: title.trim(),
            content: content.trim(),
            releaseDate: release,
            userId: user._id,
            userEmail: user.email, // Use user's email from DB
        };

        // Save capsule to MongoDB
        const newCapsule = new Capsule(capsuleData);
        await newCapsule.save();

        res.status(201).json({ message: "Capsule created successfully!" });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Server error: " + error.message });
    }
});

router.get("/user", isAuthenticated, async (req, res) => {
    try {
        const capsules = await Capsule.find({ userId: req.session.userId }).sort({
            createdAt: -1, // Sort by creation date, newest first
        });
        res.status(200).json({ capsules });
    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
});

module.exports = router;