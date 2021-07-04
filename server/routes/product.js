const router = require('express').Router();
const Product = require('../schema').product;
const Base = require('../schema').base;
const multer = require('multer');
const fs = require('fs');
const slugify = require('slugify');

const storage = multer.diskStorage({
    destination: '../client/public/products',
    filename: (req, file, cb) => {
      cb(null, `${file.originalname}`);
    }
});
    
var upload = multer({storage: storage});

router.get('/TableData', async (req, res) => {
    const products = await Product.find({}).populate('base');
    if (!products) res.json({data: []});
    else res.json({data: products});
});

router.get('/getProduct', async (req, res) => {
    const product = await Product.findOne({slug: req.query.slug}, {_id: 0, base: 0});
    if (!product) res.json({data: null});
    else res.json({data: product});
});

router.get('/shop', async (req, res) => {
    const number = 9 * (parseInt(req.query.page) - 1);
    const products = await Product.find({}, {_id: 0, description: 0, base: 0}, {skip: number, limit: 9}).sort('name');
    if (!products) res.json({data: []});
    res.json({data: products});
});

router.get('/count', async (req, res) => {
    const count = await Product.countDocuments({});
    res.json({data: count});
});

router.post('/add', upload.single('file'), async (req, res) => {
    const file = req.file;
    if (file) {
        const data = JSON.parse(req.body.data);
        const base = await Base.findOne({_id: data.baseID});
        const newProduct = new Product({
            name: data.name,
            slug: slugify(data.name, { lower: true }),
            description: data.description,
            price: data.price,
            imagePath: `/products/${file.filename}`,
            base:base
        });
        newProduct.save();
        res.json({data: 'success'});
    } else {
        res.json({data: 'failed'});
    }
});

router.post('/update', upload.single('file'), async (req, res) => {
    const file = req.file;
    const data = JSON.parse(req.body.data);
    const base = await Base.findOne({_id: data.baseID});
    const product = await Product.findOne({_id: data._id});
    product.name = data.name;
    product.slug = slugify(data.name, { lower: true });
    product.description = data.description;
    product.price = data.price;
    product.base = base;
    if (file) {
        try {
            await fs.unlinkSync(`../client/public${product.imagePath}`);
            product.imagePath = `/products/${file.filename}`;
        } catch (error) {
            console.error('there was an error:', error.message);
        }
    }
    product.save();
    res.json({data: 'success'});
});

router.get('/getByIds', async (req, res) => {
    let id = '';
    if ('id' in req.query) id = req.query.id;
    const getIds = id.split(',');
    const products = await Product.find({_id: getIds});
    if (!products) res.json({data: []});
    else res.json({data: products});
});

router.post('/delete', async (req, res) => {
    const products = await Product.find({_id: req.body.ids});
    products.forEach(async product => {
        try {
            await fs.unlinkSync(`../client/public${product.imagePath}`);
        } catch (error) {
            console.error('there was an error:', error.message);
        }
    });
    await Product.deleteMany({_id: req.body.ids});
    res.json({data: 'success'});
});

module.exports = router;