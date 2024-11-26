const Payment = require("../models/Payment");
const Order = require("../models/Order");
const snap = require("../configs/midtrans");

// Process Payment
exports.processPayment = async (req, res) => {
  const { orderId, totalPrice, customerDetails } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Create transaction parameters for Midtrans
    const transactionParams = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalPrice,
      },
      customer_details: customerDetails,
    };

    // Create transaction using Midtrans Snap
    const transaction = await snap.createTransaction(transactionParams);
    const transactionToken = transaction.token;
    const redirectUrl = transaction.redirect_url;

    // Create payment object with pending status
    const payment = new Payment({
      orderId,
      totalPrice,
      paymentMethod: "Midtrans",
      status: "Pending",
      transactionId: transactionToken,
    });

    // Save payment object to database
    await payment.save();

    // Uncomment this code to update order status to "Paid" after payment
    //  order.status = "Paid";
    //  await order.save();
 
    // Respond with the transaction token for frontend to proceed with payment
    res.status(201).json({ token: transactionToken, redirect_url: redirectUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Payment Detail by Order ID
exports.getPaymentByOrderId = async (req, res) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId });

    if (payment) {
      res.json(payment);
    } else {
      res.status(404).json({ message: "Payment not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
