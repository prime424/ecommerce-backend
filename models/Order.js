const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: false, 
    index: true   // faster queries by user
  },
  items: [{
    productId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    img: { type: String, required: true }
  }],
  totalAmount: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  customerDetails: {
    fullName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    address: { type: String, required: true }
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed'], 
    default: 'pending',
    index: true
  },
  orderStatus: { 
    type: String, 
    enum: ['processing', 'shipped', 'delivered', 'cancelled'], 
    default: 'processing',
    index: true
  }
}, {
  timestamps: true  // automatically adds createdAt and updatedAt
});

// Optional: pre‑save validation to ensure items array is not empty
orderSchema.pre('save', function(next) {
  if (this.items.length === 0) {
    next(new Error('Order must contain at least one item'));
  }
  if (this.totalAmount <= 0) {
    next(new Error('Total amount must be greater than 0'));
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);