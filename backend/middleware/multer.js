// multer.js

const multer = require('multer');
const path = require('path');

// Define storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Images will be saved in the 'uploads/' folder
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname); // Get the file extension
        cb(null, Date.now() + ext); // Use timestamp as the filename to avoid duplicates
    }
});

// Initialize multer with the storage settings
const upload = multer({ storage: storage });

module.exports = upload;
