// controllers/orderController.js
const Order = require('../models/Order');
const crypto = require('crypto'); // Used to generate unique code

// View all orders (Admin - Tekmart WebApp)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId items.productId');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
};

// View all orders by a specific user (Pengguna)
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.userId // get from verifyToken middleware
    const orders = await Order.find({ userId }).populate('items.productId');
    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve user orders' });
  }
};

// Create a new order (Pengguna)
exports.createOrder = async (req, res) => {
  try {
    const { items, totalPrice } = req.body;
    const userId = req.userId // get from verifyToken middleware
    // Generate a unique code for verification (simple random string)
    const uniqueCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    const newOrder = new Order({
      userId,
      items,
      totalPrice,
      uniqueCode
    });
    
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(err.statusCode400 || 500).json({ error: err.message || 'Failed to create order' });
  }
};

// Update order (Tekmart WebApp or Petugas Tekmart)
exports.updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(orderId, req.body, {
      new: true
    });
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order' });
  }
};

// Delete order (Pengguna)
exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
};

// Verify order using unique code (Petugas Tekmart)
exports.verifyOrder = async (req, res) => {
  try {
    const { uniqueCode } = req.params;
    const order = await Order.findOne({ uniqueCode });

    if (!order) {
      return res.status(404).json({ message: 'Order not found or invalid code' });
    }

    // Update order status to 'Selesai' after successful verification
    order.statusOrder = 'Selesai';
    await order.save();

    res.status(200).json({ message: 'Order successfully verified', order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify order' });
  }
};

