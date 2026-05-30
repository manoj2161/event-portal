const Registration = require('../models/Registration');
const Event = require('../models/Event');

// @desc   Register for an event
// @route  POST /api/registrations
// @access Private/Student
const registerForEvent = async (req, res) => {
  const { eventId } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.currentParticipants >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event is full' });
    }

    const alreadyRegistered = await Registration.findOne({
      studentId: req.user._id,
      eventId,
    });
    if (alreadyRegistered) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    const registration = await Registration.create({
      studentId: req.user._id,
      eventId,
    });

    // Increment participant count
    event.currentParticipants += 1;
    await event.save();

    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get my registrations
// @route  GET /api/registrations/my
// @access Private/Student
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ studentId: req.user._id })
      .populate('eventId')
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Cancel registration
// @route  PUT /api/registrations/:id/cancel
// @access Private/Student
const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findOne({
      _id: req.params.id,
      studentId: req.user._id,
    });

    if (!registration) return res.status(404).json({ message: 'Registration not found' });
    if (registration.status === 'Cancelled') {
      return res.status(400).json({ message: 'Already cancelled' });
    }

    registration.status = 'Cancelled';
    await registration.save();

    // Decrement participant count
    await Event.findByIdAndUpdate(registration.eventId, {
      $inc: { currentParticipants: -1 },
    });

    res.json({ message: 'Registration cancelled', registration });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all registrations (admin)
// @route  GET /api/registrations
// @access Private/Admin
const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate('studentId', 'name email')
      .populate('eventId', 'title date venue')
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerForEvent, getMyRegistrations, cancelRegistration, getAllRegistrations };
