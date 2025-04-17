const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
      quantity: Number
    }
  ],
  totalAmount: Number,
  deliveryPerson: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'processing','accepted', 'preparing', 'delivering', 'completed'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' }
  ,
  commissionDetails: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
      commission: Number
    }
  ]}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
