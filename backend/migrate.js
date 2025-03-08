const mongoose = require("mongoose");
const Capsule = require("./models/capsule");
require("dotenv").config(); // Load .env for ENCRYPTION_KEY

// Import encrypt from capsules.js
const { encrypt } = require("./routes/capsules");

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("Connected to MongoDB for migration");
        // After the migration loop, remove content field
        await Capsule.updateMany({}, { $unset: { content: 1 } });
        console.log("Removed content field from all capsules.");

        // Find all capsules without encryptedContent
        const capsulesToMigrate = await Capsule.find({ encryptedContent: { $exists: false } });

        if (capsulesToMigrate.length === 0) {
            console.log("No capsules need migration. All are already encrypted!");
            await Capsule.updateMany({}, { $unset: { content: 1 } });
            console.log("Removed content field from all capsules.");
            process.exit(0);

        }

        console.log(`Found ${capsulesToMigrate.length} capsules to migrate...`);

        // Migrate each capsule
        for (const capsule of capsulesToMigrate) {
            try {
                if (capsule.content) {
                    const encryptedContent = encrypt(capsule.content.trim());
                    capsule.encryptedContent = encryptedContent;
                    await capsule.save();
                    console.log(`Migrated capsule ${capsule._id}: Encrypted content`);
                } else {
                    console.log(`Skipped capsule ${capsule._id}: No content to encrypt`);
                }
            } catch (error) {
                console.error(`Error migrating capsule ${capsule._id}:`, error);
            }
        }

        console.log("Migration complete! Check logs for any errors.");
        // After the migration loop, remove content field

        process.exit(0);

    })

    .catch((err) => {
        console.error("MongoDB connection error during migration:", err);
        process.exit(1);
    });