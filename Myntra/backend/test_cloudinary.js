require('dotenv').config();
const cloudinary = require('./config/cloudinary');

async function testCloudinary() {
  try {
    const res = await cloudinary.api.ping();
    console.log("Cloudinary ping successful:", res);
  } catch (err) {
    console.error("Cloudinary error:", err);
  }
}

testCloudinary();
