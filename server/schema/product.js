var mongoose = require('mongoose')
  , Schema = mongoose.Schema

const productSchema = new mongoose.Schema({
    name:String,
    slug:String,
    description:String,
    price:Number,
    imagePath:String,
    base: {
        type: Schema.Types.ObjectId,
        ref: 'bases'
    }
});

const Product = mongoose.model('products', productSchema);

module.exports = Product;