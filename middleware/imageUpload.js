const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage for multer
const storage = multer.memoryStorage();

// Create multer upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit (increased for PDF resumes)
  },
  fileFilter: (req, file, cb) => {
    // Check file type - allow images and PDFs
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else if (file.mimetype === 'application/pdf' && file.fieldname === 'resumeFile') {
      cb(null, true);
    } else if (file.mimetype === 'application/pdf') {
      cb(new Error('PDF files are only allowed for resume uploads!'), false);
    } else {
      cb(new Error('Only image files and PDF resumes are allowed!'), false);
    }
  },
});

// Function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder = 'company-profiles', fileType = 'image') => {
  return new Promise((resolve, reject) => {
    let uploadOptions = {
      folder: folder,
    };

    // Apply transformations only for images
    if (fileType === 'image') {
      uploadOptions.transformation = [
        { width: 400, height: 400, crop: 'limit' },
        { quality: 'auto' }
      ];
    } else if (fileType === 'pdf') {
      uploadOptions.resource_type = 'raw'; // For non-image files
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};

module.exports = {
  upload,
  cloudinary,
  uploadToCloudinary
};
