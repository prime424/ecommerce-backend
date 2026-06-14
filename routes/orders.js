const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');

// Helper function to validate order data
const validateOrder = (orderData) => {
  const { items, totalAmount, customerDetails } = orderData;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return 'Order must contain at least one item';
  }
  if (!totalAmount || totalAmount <= 0) {
    return 'Total amount must be greater than 0';
  }
  if (!customerDetails || !customerDetails.fullName || !customerDetails.email || !customerDetails.address) {
    return 'Customer details (fullName, email, address) are required';
  }
  if (!/\S+@\S+\.\S+/.test(customerDetails.email)) {
    return 'Invalid email format';
  }
  for (const item of items) {
    if (!item.productId || !item.name || !item.price || !item.quantity || !item.img) {
      return 'Each item must have productId, name, price, quantity, and img';
    }
    if (item.quantity < 1) return 'Item quantity must be at least 1';
    if (item.price < 0) return 'Item price cannot be negative';
  }
  return null;
};

// Create a new order (protected)
router.post('/', auth, async (req, res) => {
  try {
    const validationError = validateOrder(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const orderData = { ...req.body, userId: req.userId };
    const order = new Order(orderData);
    await order.save();
    res.status(201).json({ 
      message: 'Order saved successfully', 
      orderId: order._id,
      orderStatus: order.orderStatus
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ message: 'Server error while creating order' });
  }
});

// Get all orders for the logged‑in user (protected)
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select('-__v');
    res.json(orders);
  } catch (err) {
    console.error('Fetch orders error:', err);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
});

// Get a single order by ID (protected)
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.userId }).select('-__v');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error('Fetch order error:', err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }
    res.status(500).json({ message: 'Server error while fetching order' });
  }
});

// Optional: Update order status (admin only – not implemented here)
// router.patch('/:id/status', auth, adminOnly, ...)

module.exports = router;