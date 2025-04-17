const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  category: String,
  commissionRate: Number,
  image: String,
  totalCommission: { type: Number, default: 0 }
}, { timestamps: true });

restaurantSchema.index({ owner: 1, name: 1 }, { unique: true }); // ✅ Enforce 1 restaurant per owner with same name


module.exports = mongoose.model('Restaurant', restaurantSchema);
