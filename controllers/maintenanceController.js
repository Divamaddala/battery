const Maintenance = require('../models/Maintenance');
const Battery = require('../models/Battery');

// Get all maintenance records
exports.getMaintenance = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const maintenance = await Maintenance.find(filter)
      .populate('battery', 'serialNumber model manufacturer')
      .populate('technician', 'name email')
      .populate('createdBy', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ scheduledDate: 1 });

    const total = await Maintenance.countDocuments(filter);

    res.json({
      maintenance,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create maintenance record
exports.createMaintenance = async (req, res) => {
  try {
    const maintenanceData = {
      ...req.body,
      createdBy: req.user.id
    };

    const maintenance = await Maintenance.create(maintenanceData);
    
    // Update battery status if maintenance is scheduled
    if (maintenance.status === 'scheduled') {
      await Battery.findByIdAndUpdate(req.body.battery, {
        status: 'maintenance',
        lastMaintenance: new Date()
      });
    }

    await maintenance.populate('battery', 'serialNumber model manufacturer');
    await maintenance.populate('technician', 'name email');

    res.status(201).json(maintenance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update maintenance record
exports.updateMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('battery', 'serialNumber model manufacturer')
      .populate('technician', 'name email');

    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    // Update battery status if maintenance is completed
    if (maintenance.status === 'completed') {
      await Battery.findByIdAndUpdate(maintenance.battery._id, {
        status: 'active',
        lastMaintenance: maintenance.completedDate,
        nextMaintenance: new Date(maintenance.completedDate).setMonth(new Date(maintenance.completedDate).getMonth() + 3) // 3 months later
      });
    }

    res.json(maintenance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get overdue maintenance
exports.getOverdueMaintenance = async (req, res) => {
  try {
    const today = new Date();
    
    const overdue = await Maintenance.find({
      scheduledDate: { $lt: today },
      status: { $in: ['scheduled', 'in-progress'] }
    })
      .populate('battery', 'serialNumber model manufacturer health')
      .populate('technician', 'name email')
      .sort({ scheduledDate: 1 });

    res.json(overdue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};