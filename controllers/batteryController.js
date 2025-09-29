const Battery = require('../models/Battery');
const Maintenance = require('../models/Maintenance');

// Get all batteries
exports.getBatteries = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const batteries = await Battery.find(filter)
      .populate('createdBy', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Battery.countDocuments(filter);

    res.json({
      batteries,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single battery
exports.getBattery = async (req, res) => {
  try {
    const battery = await Battery.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!battery) {
      return res.status(404).json({ message: 'Battery not found' });
    }

    // Get maintenance history
    const maintenance = await Maintenance.find({ battery: req.params.id })
      .populate('technician', 'name')
      .sort({ scheduledDate: -1 });

    res.json({
      battery,
      maintenance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create battery
exports.createBattery = async (req, res) => {
  try {
    const batteryData = {
      ...req.body,
      createdBy: req.user.id
    };

    const battery = await Battery.create(batteryData);
    await battery.populate('createdBy', 'name email');

    res.status(201).json(battery);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Serial number already exists' });
    }
    res.status(400).json({ message: error.message });
  }
};

// Update battery
exports.updateBattery = async (req, res) => {
  try {
    const battery = await Battery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!battery) {
      return res.status(404).json({ message: 'Battery not found' });
    }

    res.json(battery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete battery
exports.deleteBattery = async (req, res) => {
  try {
    const battery = await Battery.findById(req.params.id);
    
    if (!battery) {
      return res.status(404).json({ message: 'Battery not found' });
    }

    await Battery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Battery deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get battery stats
exports.getBatteryStats = async (req, res) => {
  try {
    const totalBatteries = await Battery.countDocuments();
    const activeBatteries = await Battery.countDocuments({ status: 'active' });
    const maintenanceBatteries = await Battery.countDocuments({ status: 'maintenance' });
    const faultyBatteries = await Battery.countDocuments({ status: 'faulty' });
    
    const avgHealth = await Battery.aggregate([
      { $group: { _id: null, avgHealth: { $avg: '$health' } } }
    ]);

    const typeDistribution = await Battery.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    res.json({
      totalBatteries,
      activeBatteries,
      maintenanceBatteries,
      faultyBatteries,
      averageHealth: avgHealth[0]?.avgHealth || 0,
      typeDistribution
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};