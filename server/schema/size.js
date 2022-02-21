var mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    price: { type: Number, required: true },
    active: { type: Boolean, required: true }
});

const Color = mongoose.model('sizes', sizeSchema);

module.exports = Color;