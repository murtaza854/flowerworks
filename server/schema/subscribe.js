var mongoose = require('mongoose');

const subscribeSchema = new mongoose.Schema({
    packageLength: { type: Number, required: true },
    packageLengthUnit: { type: String, required: true },
    base: { type: String, required: true },
    baseAmount: { type: Number, required: true },
    price: { type: Number, required: true },
    active: { type: Boolean, required: true, default: true },
});

const Subscribe = mongoose.model('subscribes', subscribeSchema);

module.exports = Subscribe;