const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, "../uploads");
        cb(null, uploadPath); // Use absolute path from config directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); // Unique filename
    },
});

const upload = multer({ storage: storage });

module.exports = upload;