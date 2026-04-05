const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  resi: { type: String, unique: true, required: true },
  date: { type: String, required: true },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    city: { type: String },
    address: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    qty: Number,
    image: String
  }],
  totalPaid: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['On Process', 'Shipped', 'Out for Delivery', 'Delivered'],
    default: 'On Process' 
  },
  invoiceId: { type: String },
  paymentMethod: { type: String },
  paymentStatus: { 
    type: String, 
    enum: ['PENDING', 'PAID', 'FAILED'],
    default: 'PENDING' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
