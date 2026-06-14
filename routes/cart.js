const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Cart = require('../models/Cart');

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      cart = { userId: req.userId, items: [], totalAmount: 0 };
    }
    res.json(cart);
  } catch (err) {
    console.error('Fetch cart error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add or update item in cart
router.post('/', auth, async (req, res) => {
  try {
    const { productId, name, price, quantity, img } = req.body;
    if (!productId || !name || !price || !quantity || !img) {
      return res.status(400).json({ message: 'Missing product details' });
    }

    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      cart = new Cart({ userId: req.userId, items: [], totalAmount: 0 });
    }

    const existingIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (existingIndex !== -1) {
      cart.items[existingIndex].quantity = quantity;
    } else {
      cart.items.push({ productId, name, price, quantity, img });
    }

    // Recalculate totalAmount
    cart.totalAmount = cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove an item from cart
router.delete('/:productId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
    cart.totalAmount = cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;