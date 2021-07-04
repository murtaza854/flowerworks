var mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
    name:String,
    slug:String,
    price:Number,
});

const Color = mongoose.model('sizes', sizeSchema);

module.exports = Color;