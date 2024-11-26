const express = require('express');

const {
    processPayment,
    getPaymentByOrderId,
  } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Process Payment
router.post('/', protect, processPayment);

// Get Payment by Order ID
router.get('/order/:orderId', protect, getPaymentByOrderId);

module.exports = router;
