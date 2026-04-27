const express = require('express');
const {
  createService,
  getAllServices,
  getMyServices,
  getServiceById,
  hireService,
} = require('../controllers/serviceController');
const { protect, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllServices);
router.get('/my', protect, authorizeRoles('worker'), getMyServices);
router.post('/', protect, authorizeRoles('worker'), createService);
router.get('/:id', getServiceById);
router.post('/:id/hire', protect, authorizeRoles('customer', 'employer'), hireService);

module.exports = router;
