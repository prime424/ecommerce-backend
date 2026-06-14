const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Simulate payment
router.post('/process', auth, async (req, res) => {
  try {
    const { orderId, paymentMethod = 'card' } = req.body;
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID required' });
    }

    const order = await Order.findOne({ _id: orderId, userId: req.userId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Order already paid' });
    }

    // Simulate payment processing (e.g., call Stripe here)
    // In real world, you would use stripe.paymentIntents.create()

    // For demo, we assume success
    order.paymentStatus = 'paid';
    order.orderStatus = 'processing';
    await order.save();

    // Clear the user's cart after successful payment
    await Cart.findOneAndDelete({ userId: req.userId });

    res.json({
      message: 'Payment successful',
      orderId: order._id,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus
    });
  } catch (err) {
    console.error('Payment error:', err);
    res.status(500).json({ message: 'Payment failed' });
  }
});

module.exports = router;