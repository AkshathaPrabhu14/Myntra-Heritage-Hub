const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getProductStats,
  getSuggestions,
  generateOutfit,
} = require('../controllers/productController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

const handleUpload = (req, res, next) => {
  upload.array('images', 8)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

// Public routes
router.get('/', getProducts);
router.get('/stats', getProductStats);
router.get('/suggestions', getSuggestions);
router.get('/outfit-planner', generateOutfit);
router.get('/:id', getProductById);

// Protected admin routes
router.post('/', protect, isAdmin, handleUpload, createProduct);
router.put('/:id', protect, isAdmin, handleUpload, updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);

// Protected user routes
router.post('/:id/reviews', protect, addReview);

module.exports = router;
