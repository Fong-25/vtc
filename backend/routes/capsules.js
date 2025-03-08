require('dotenv').config(); // Add this line at the top of the file
const express = require("express");
const router = express.Router();
const Capsule = require("../models/capsule");
const User = require("../models/user");
const crypto = require("crypto"); // Node.js built-in crypto module

// Load encryption key from .env
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 32 bytes (256 bits)
const IV_LENGTH = 16; // For AES, IV is always 16 bytes
// console.log("ENCRYPTION_KEY in capsules.js:", ENCRYPTION_KEY);

// if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
//     throw new Error(
//         "ENCRYPTION_KEY is not set or is not 32 characters long in .env. Please check your .env file and restart the server."
//     );
// }
// Encryption function (AES-256-CBC)
// Export encrypt and decrypt functions
function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(text) {
    const [iv, encryptedText] = text.split(":").map((part) => Buffer.from(part, "hex"));
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

const isAuthenticated = (req, res, next) => {
    // console.log("Session userId:", req.session.userId);
    if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    next();
};

router.post("/create", isAuthenticated, async (req, res) => {
    try {
        // console.log("Request body:", req.body);

        const { title, content, releaseDate } = req.body;

        if (!title?.trim() || !content?.trim() || !releaseDate) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        const release = new Date(releaseDate);
        if (isNaN(release.getTime())) {
            return res.status(400).json({ error: "Invalid release date" });
        }

        const encryptedContent = encrypt(content.trim());

        const capsuleData = {
            title: title.trim(),
            encryptedContent: encryptedContent,
            releaseDate: release,
            userId: user._id,
            userEmail: user.email,
        };

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
            createdAt: -1,
        });
        // console.log("Capsules fetched:", capsules);

        const capsulesWithContent = capsules.map((capsule) => {
            let displayContent;
            try {
                displayContent = decrypt(capsule.encryptedContent);
            } catch (error) {
                console.error("Decryption error for capsule:", capsule._id, error);
                displayContent = "[Decryption Failed]";
            }
            return {
                ...capsule.toObject(),
                content: displayContent,
            };
        });

        res.status(200).json({ capsules: capsulesWithContent });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Server error: " + error.message });
    }
});

router.delete("/:id", isAuthenticated, async (req, res) => {
    try {
        console.log("Deleting capsule with ID:", req.params.id);
        const capsule = await Capsule.findOne({
            _id: req.params.id,
            userId: req.session.userId,
        });
        if (!capsule) {
            return res.status(404).json({ error: "Capsule not found or unauthorized" });
        }

        await Capsule.deleteOne({ _id: req.params.id });
        console.log("Capsule deleted successfully from DB");
        res.status(200).json({ message: "Capsule deleted successfully!" });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Server error: " + error.message });
    }
});

module.exports = {
    router,
    encrypt,
    decrypt,
};