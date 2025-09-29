const Maintenance = require('../models/Maintenance');

class NotificationService {
  static async checkUpcomingMaintenance() {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const upcoming = await Maintenance.find({
      scheduledDate: { $lte: sevenDaysFromNow, $gte: new Date() },
      status: 'scheduled'
    })
      .populate('battery', 'serialNumber model')
      .populate('technician', 'name email');

    return upcoming;
  }

  static async checkWarrantyExpiry() {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    // This would need battery model adjustment for virtual field query
    // For now, it's a placeholder
    return [];
  }
}

module.exports = NotificationService;