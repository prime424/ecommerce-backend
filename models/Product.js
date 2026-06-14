const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Product name is required'],
    trim: true,
    index: true
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    trim: true,
    index: true
  },
  price: { 
    type: Number, 
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  img: { 
    type: String, 
    required: [true, 'Image URL is required'],
    trim: true
  },
  trending: { 
    type: Boolean, 
    default: false,
    index: true
  },
  inStock: { 
    type: Boolean, 
    default: true,
    index: true
  }
}, {
  timestamps: true  // adds createdAt and updatedAt automatically
});

// Optional: add text index for search by name
productSchema.index({ name: 'text' });

module.exports = mongoose.model('Product', productSchema);