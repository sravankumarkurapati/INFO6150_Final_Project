const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  amount: Number,
  method: String,
  paymentId: String,
  status: {
    type: String,
    enum: ['PAID', 'FAILED'],
    default: 'PAID'
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);