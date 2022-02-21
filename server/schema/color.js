var mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    price: { type: Number, required: true },
    active: { type: Boolean, required: true }
});

const Color = mongoose.model('colors', colorSchema);

module.exports = Color;