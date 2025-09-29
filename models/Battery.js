const mongoose = require('mongoose');

const batterySchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    required: [true, 'Serial number is required'],
    unique: true,
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Model is required'],
    trim: true
  },
  manufacturer: {
    type: String,
    required: [true, 'Manufacturer is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Li-ion', 'Lead-Acid', 'NiMH', 'NiCd', 'Other'],
    required: true
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: 0
  },
  voltage: {
    type: Number,
    required: [true, 'Voltage is required'],
    min: 0
  },
  purchaseDate: {
    type: Date,
    required: [true, 'Purchase date is required']
  },
  warrantyMonths: {
    type: Number,
    default: 12
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'retired', 'faulty'],
    default: 'active'
  },
  health: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  currentCycle: {
    type: Number,
    default: 0
  },
  maxCycles: {
    type: Number,
    default: 500
  },
  location: {
    building: String,
    room: String,
    rack: String
  },
  lastMaintenance: Date,
  nextMaintenance: Date,
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Calculate health based on cycles
batterySchema.methods.calculateHealth = function() {
  const cycleUsage = (this.currentCycle / this.maxCycles) * 100;
  this.health = Math.max(0, 100 - cycleUsage);
  return this.health;
};

// Virtual for warranty expiry
batterySchema.virtual('warrantyExpiry').get(function() {
  const expiry = new Date(this.purchaseDate);
  expiry.setMonth(expiry.getMonth() + this.warrantyMonths);
  return expiry;
});

module.exports = mongoose.model('Battery', batterySchema);