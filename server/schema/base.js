const mongoose = require('mongoose');

const baseSchema = new mongoose.Schema({
    name:String,
    slug:String,
    price:Number,
    imagePath:String
});

const Base = mongoose.model('bases', baseSchema);

module.exports = Base;