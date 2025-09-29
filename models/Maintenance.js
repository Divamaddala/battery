const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  battery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Battery',
    required: true
  },
  type: {
    type: String,
    enum: ['routine', 'repair', 'inspection', 'replacement'],
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  completedDate: Date,
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  description: String,
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  actionsPerformed: [String],
  partsReplaced: [{
    name: String,
    quantity: Number,
    cost: Number
  }],
  cost: {
    type: Number,
    default: 0
  },
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);