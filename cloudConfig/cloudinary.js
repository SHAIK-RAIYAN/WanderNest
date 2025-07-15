const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

//defining storage in cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "WanderNest",
    allowed_formats: ["jpeg", "png", "jpg", "webp"],
  },
});

module.exports = { cloudinary, storage };
