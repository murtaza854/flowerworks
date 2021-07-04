var mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
    name:String,
    slug:String,
    price:Number,
});

const Color = mongoose.model('colors', colorSchema);

module.exports = Color;