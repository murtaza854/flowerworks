var mongoose = require('mongoose');

const flowerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    price: { type: Number, required: true },
    active: { type: Boolean, required: true }
});

const Color = mongoose.model('flowers', flowerSchema);

module.exports = Color;