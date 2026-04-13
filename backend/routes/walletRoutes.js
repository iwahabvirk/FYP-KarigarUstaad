const express = require('express');
const {
  getWallet,
  payForJob,
  withdrawFromWallet,
} = require('../controllers/walletController');

const router = express.Router();

const { protect, authorizeRoles } = require('../middleware/auth');

router.route('/').get(protect, getWallet);

router.route('/withdraw').post(protect, authorizeRoles('worker'), withdrawFromWallet);

module.exports = router;