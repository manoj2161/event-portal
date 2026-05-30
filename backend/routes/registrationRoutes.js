const express = require('express');
const router = express.Router();
const {
  registerForEvent, getMyRegistrations, cancelRegistration, getAllRegistrations,
} = require('../controllers/registrationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/',          protect, authorize('student'), registerForEvent);
router.get('/my',         protect, authorize('student'), getMyRegistrations);
router.put('/:id/cancel', protect, authorize('student'), cancelRegistration);
router.get('/',           protect, authorize('admin'),   getAllRegistrations);

module.exports = router;
