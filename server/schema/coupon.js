const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const couponSchema = new mongoose.Schema({
    name: { type: String, required: true },
    minAmount: { type: Number, required: true },
    type: { type: String, required: true },
    amountOff: { type: Number },
    percentOff: { type: Number },
    redeemBy: { type: Date },
    maxRedemptions: { type: Number },
    appliedToProducts: { type: Boolean, required: true },
    appliedToAddons: { type: Boolean, required: true },
    appliedToDIY: { type: Boolean, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'products' }],
    addons: [{ type: Schema.Types.ObjectId, ref: 'addons' }],
    timesRedeeemed: { type: Number, required: true },
    active: { type: Boolean, required: true }
});

const Coupon = mongoose.model('coupons', couponSchema);

module.exports = Coupon;