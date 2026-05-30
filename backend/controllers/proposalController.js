const Proposal = require('../models/Proposal');
const Event = require('../models/Event');

// @desc   Submit a proposal
// @route  POST /api/proposals
// @access Private/Organizer
const createProposal = async (req, res) => {
  try {
    const proposal = await Proposal.create({
      ...req.body,
      organizerId: req.user._id,
      status: 'Pending',
    });
    res.status(201).json(proposal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get proposals (admin: all | organizer: own)
// @route  GET /api/proposals
// @access Private
const getProposals = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { organizerId: req.user._id };
    const proposals = await Proposal.find(filter)
      .populate('organizerId', 'name email')
      .sort({ createdAt: -1 });
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get single proposal
// @route  GET /api/proposals/:id
// @access Private
const getProposalById = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate('organizerId', 'name email');
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });
    res.json(proposal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update proposal (organizer edits own pending proposal)
// @route  PUT /api/proposals/:id
// @access Private/Organizer
const updateProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findOne({ _id: req.params.id, organizerId: req.user._id });
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });
    if (proposal.status !== 'Pending') {
      return res.status(400).json({ message: 'Can only edit pending proposals' });
    }
    Object.assign(proposal, req.body);
    await proposal.save();
    res.json(proposal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Approve proposal → auto-create event
// @route  PUT /api/proposals/:id/approve
// @access Private/Admin
const approveProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

    proposal.status = 'Approved';
    proposal.adminNote = req.body.adminNote || '';
    await proposal.save();

    // Auto-create the event from proposal
    const event = await Event.create({
      title: proposal.title,
      description: proposal.description,
      category: proposal.category,
      venue: proposal.venue,
      date: proposal.date,
      maxParticipants: proposal.maxParticipants,
      createdBy: req.user._id,
    });

    res.json({ proposal, event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Reject proposal
// @route  PUT /api/proposals/:id/reject
// @access Private/Admin
const rejectProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

    proposal.status = 'Rejected';
    proposal.adminNote = req.body.adminNote || '';
    await proposal.save();

    res.json(proposal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProposal, getProposals, getProposalById,
  updateProposal, approveProposal, rejectProposal,
};
