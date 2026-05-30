const User = require('../models/User');
const Event = require('../models/Event');
const Proposal = require('../models/Proposal');
const Registration = require('../models/Registration');

// @desc   Get dashboard stats
// @route  GET /api/admin/stats
// @access Private/Admin
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalEvents, pendingProposals, totalRegistrations] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Proposal.countDocuments({ status: 'Pending' }),
      Registration.countDocuments({ status: 'Confirmed' }),
    ]);

    const studentCount = await User.countDocuments({ role: 'student' });
    const organizerCount = await User.countDocuments({ role: 'organizer' });

    res.json({
      totalUsers,
      totalEvents,
      pendingProposals,
      totalRegistrations,
      studentCount,
      organizerCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all users
// @route  GET /api/admin/users
// @access Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete user
// @route  DELETE /api/admin/users/:id
// @access Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats, getAllUsers, deleteUser };
