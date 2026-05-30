const express = require('express');
const router = express.Router();
const {
  createProposal, getProposals, getProposalById,
  updateProposal, approveProposal, rejectProposal,
} = require('../controllers/proposalController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/',    protect, getProposals);
router.get('/:id', protect, getProposalById);
router.post('/',   protect, authorize('organizer'), createProposal);
router.put('/:id', protect, authorize('organizer'), updateProposal);
router.put('/:id/approve', protect, authorize('admin'), approveProposal);
router.put('/:id/reject',  protect, authorize('admin'), rejectProposal);

module.exports = router;
