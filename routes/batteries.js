const express = require('express');
const {
  getBatteries,
  getBattery,
  createBattery,
  updateBattery,
  deleteBattery,
  getBatteryStats
} = require('../controllers/batteryController');
const { auth, technicianAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getBatteries);
router.get('/stats', auth, getBatteryStats);
router.get('/:id', auth, getBattery);
router.post('/', auth, technicianAuth, createBattery);
router.put('/:id', auth, technicianAuth, updateBattery);
router.delete('/:id', auth, technicianAuth, deleteBattery);

module.exports = router;