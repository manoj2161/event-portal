const express = require('express');
const router = express.Router();
const { getStats, getAllUsers, deleteUser } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/stats',        protect, authorize('admin'), getStats);
router.get('/users',        protect, authorize('admin'), getAllUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
