var mongoose = require('mongoose');

const flowerSchema = new mongoose.Schema({
    name:String,
    slug:String,
    price:Number,
});

const Color = mongoose.model('flowers', flowerSchema);

module.exports = Color;