var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    sizes: [{
        name: { type: String, required: true },
        price: { type: Number, required: true },
    }],
    // options: [{
    //     name: { type: String, required: true },
    //     price: { type: Number, required: true },
    // }],
    // addons: [{
    //     name: { type: String, required: true },
    //     price: { type: Number, required: true },
    // }],
    image: { type: String, required: true },
    fileName: { type: String, required: true },
    active: { type: Boolean, required: true },
    base: { type: Schema.Types.ObjectId, ref: 'bases', required: true },
});

const Product = mongoose.model('products', productSchema);

module.exports = Product;