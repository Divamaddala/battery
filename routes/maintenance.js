const express = require('express');
const {
  getMaintenance,
  createMaintenance,
  updateMaintenance,
  getOverdueMaintenance
} = require('../controllers/maintenanceController');
const { auth, technicianAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getMaintenance);
router.get('/overdue', auth, getOverdueMaintenance);
router.post('/', auth, technicianAuth, createMaintenance);
router.put('/:id', auth, technicianAuth, updateMaintenance);

module.exports = router;