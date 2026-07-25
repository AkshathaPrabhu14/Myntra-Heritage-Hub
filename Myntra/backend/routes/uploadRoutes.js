const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// @desc    Upload product images
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, isAdmin, (req, res) => {
  upload.array('images', 8)(req, res, (err) => {

    if (err) {
      console.error('Upload Error:', err);   // <-- Added here
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded',
        });
      }

      const imageUrls = req.files.map((file) =>
        file.path && file.path.startsWith('http')
          ? file.path
          : `/uploads/${file.filename}`
      );

      return res.json({
        success: true,
        count: imageUrls.length,
        data: imageUrls,
      });

    } catch (error) {
      console.error('TryCatch Error:', error);   // <-- Added here
      return res.status(500).json({
        success: false,
        message: 'Image upload failed',
      });
    }

  });
});

module.exports = router;