const mongoose = require('mongoose');

const baseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    fileName: { type: String, required: true },
    active: { type: Boolean, required: true },
});

const Base = mongoose.model('bases', baseSchema);

module.exports = Base;