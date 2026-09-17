const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('☁️ Cloudinary configured successfully.');
} else {
  console.log('ℹ️ Cloudinary credentials not detected; using local uploads fallback (/uploads).');
}

/**
 * Upload an image buffer or path to Cloudinary, with local storage fallback
 * @param {Buffer|string} fileBufferOrPath
 * @param {string} folder
 * @param {string} originalName
 * @returns {Promise<{url: string, public_id: string}>}
 */
const uploadToStorage = async (fileBuffer, folder = 'mehndi-zone', originalName = 'design') => {
  if (isCloudinaryConfigured && fileBuffer) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `shreyas-mehndi/${folder}`,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );
      stream.end(fileBuffer);
    });
  }

  // Local fallback
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const safeName = `${Date.now()}-${originalName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const filePath = path.join(uploadsDir, safeName);

  if (Buffer.isBuffer(fileBuffer)) {
    await fs.promises.writeFile(filePath, fileBuffer);
  }

  return {
    url: `/uploads/${safeName}`,
    public_id: safeName,
  };
};

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadToStorage,
};
