const express = require('express');
const router = express.Router();
const { getUserPassport, getPassportRecommendations } = require('../controllers/passportController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getUserPassport);
router.get('/recommendations', protect, getPassportRecommendations);

module.exports = router;
