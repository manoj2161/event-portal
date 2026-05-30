const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  category: {
    type: String,
    required: true,
    enum: ['Tech', 'Cultural', 'Sports', 'Academic', 'Workshop', 'Other'],
  },
  venue: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  maxParticipants: {
    type: Number,
    required: true,
    min: 1,
  },
  currentParticipants: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
}, { timestamps: true });

// Virtual: is event full?
eventSchema.virtual('isFull').get(function () {
  return this.currentParticipants >= this.maxParticipants;
});

module.exports = mongoose.model('Event', eventSchema);
