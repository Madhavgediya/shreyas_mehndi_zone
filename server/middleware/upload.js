const multer = require('multer');

// Configure memory storage
const storage = multer.memoryStorage();

// File filter to accept images and SVGs
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith('image/') ||
    file.mimetype === 'image/svg+xml'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WebP, SVG) are allowed!'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter,
});

module.exports = upload;
