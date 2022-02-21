var mongoose = require('mongoose');

const addonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    price: { type: Number, required: true },
    fileName: {type: String, required: true},
    image: { type: String, required: true },
    active: { type: Boolean, required: true }
});

const Addon = mongoose.model('addons', addonSchema);

module.exports = Addon;