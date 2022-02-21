const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const promotionCodeSchema = new mongoose.Schema({
    code: { type: String, required: true },
    coupon: { type: Schema.Types.ObjectId, ref: 'coupons', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    expiresAt: { type: Date },
    maxRedemptions: { type: Number },
    firstTimeTransaction: { type: Boolean, required: true },
    minAmount: { type: Number },
    timesRedeeemed: { type: Number, required: true },
    active: { type: Boolean, required: true },
});

const PromotionCode = mongoose.model('promotionCodes', promotionCodeSchema);

module.exports = PromotionCode;