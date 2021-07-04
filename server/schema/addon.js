var mongoose = require('mongoose');

const addonSchema = new mongoose.Schema({
    name:String,
    slug:String,
    description:String,
    price:Number,
    imagePath:String,
});

const Addon = mongoose.model('addons', addonSchema);

module.exports = Addon;