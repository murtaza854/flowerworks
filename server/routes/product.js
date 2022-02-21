const router = require('express').Router();
const Product = require('../schema').product;
const Base = require('../schema').base;
const Coupon = require('../schema').coupon;
const multer = require('multer');
const fs = require('fs');
const slugify = require('slugify');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // cb(null, path.resolve('../client/public/products'));
        cb(null, path.resolve('./build/products'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + Date.now() + ext);
    }
});

var upload = multer({ storage: storage });

router.get('/TableData', async (req, res) => {
    const products = await Product.find({}).populate('base');
    if (!products) res.json({ data: [] });
    else res.json({ data: products });
});

router.get('/getAllProducts', async (req, res) => {
    const products = await Product.find({}).populate('base');
    res.json({ data: products });
});

router.get('/getThree', async (req, res) => {
    const { categorySlug } = req.query;
    const Category = await Base.findOne({ slug: categorySlug });
    const products = await Product.find({ base: { $nin: [Category._id] }, active: true }, { _id: 0 }).populate('base');
    const coupons = await Coupon.find({ active: true }, { _id: 0, addons: 0 }).populate({
        path: 'products',
        select: 'name slug -_id',
    });
    res.json({ data: products, coupons });
});

router.get('/getProduct', async (req, res) => {
    const product = await Product.findOne({ slug: req.query.slug, active: true }, { _id: 0, base: 0 });
    const coupons = await Coupon.find({ active: true }, { _id: 0, addons: 0 }).populate({
        path: 'products',
        select: 'name slug -_id',
    });
    res.json({ data: product, coupons });
});

router.get('/shop', async (req, res) => {
    const number = 9 * (parseInt(req.query.page) - 1);
    const base = await Base.findOne({ slug: req.query.category });
    const products = await Product.find({ active: true, base: base }, { _id: 0, description: 0, base: 0 }, { skip: number, limit: 9 }).sort('name');
    const coupons = await Coupon.find({ active: true }, { _id: 0, addons: 0 }).populate({
        path: 'products',
        select: 'name slug -_id',
    });
    res.json({ data: products, coupons });
});

router.get('/count', async (req, res) => {
    const count = await Product.countDocuments({});
    res.json({ data: count });
});

router.post('/getById', async (req, res) => {
    try {
        const product = await Product.findById(req.body.id).populate('base');
        res.json({ data: product });
    } catch (error) {
        res.json({ data: null, error: error });
    }
});

router.post('/add', upload.single('image'), async (req, res) => {
    const data = JSON.parse(req.body.data);
    const image = req.file;
    try {
        let slug = slugify(data.name, { lower: true });
        while (true) {
            const product = await Product.findOne({ slug: slug });
            if (product) {
                if (parseInt(product.slug.split('-')[1]) > 0) {
                    slug = slug + '-' + parseInt(product.slug.split('-')[1]) + 1;
                } else {
                    slug = slug + '-1';
                }
            } else {
                break;
            }
        }
        const primaryImagePath = '/products/' + image.filename;
        const newProduct = new Product({
            name: data.name,
            slug: slug,
            description: data.description,
            sizes: data.sizes,
            // options: data.options,
            // addons: data.addons,
            image: primaryImagePath,
            fileName: image.filename,
            active: data.active,
            base: data.base
        });
        await newProduct.save();
        res.json({ data: true });
    } catch (error) {
        res.json({ data: null, error: error });
    }
});

router.post('/update', upload.single('image'), async (req, res) => {
    const data = JSON.parse(req.body.data);
    const image = req.file;
    try {
        const product = await Product.findById(data.id);
        if (product.name !== data.name) {
            let slug = slugify(data.name, { lower: true });
            while (true) {
                const product = await Product.findOne({ slug: slug });
                if (product) {
                    if (parseInt(product.slug.split('-')[1]) > 0) {
                        slug = slug + '-' + parseInt(product.slug.split('-')[1]) + 1;
                    } else {
                        slug = slug + '-1';
                    }
                } else {
                    break;
                }
            }
            product.name = data.name;
            product.slug = slug;
        }
        product.description = data.description;
        product.sizes = data.sizes;
        // product.options = data.options;
        // product.addons = data.addons;
        if (image) {
            // fs.unlinkSync(path.resolve('../client/public/products/' + product.fileName));
            fs.unlinkSync(path.resolve('./build/products/' + product.fileName));
            product.fileName = image.filename;
            product.image = '/products/' + image.filename;
        }
        product.active = data.active;
        product.base = data.base;
        await product.save();
        res.json({ data: true });
    } catch (error) {
        res.json({ data: null, error: error });
    }
});

router.get('/action', async (req, res) => {
    try {
        const ids = JSON.parse(req.query.ids);
        const updateString = req.query.updateString;
        const strings = updateString.split('_');
        const isTrueSet = (strings[1] === 'true');
        const products = await Product.find({ _id: { $in: ids } });
        products.forEach(async product => {
            product[strings[0]] = isTrueSet;
            await product.save();
        });
        res.json({ data: 'success' });
    } catch (error) {
        res.status(500).json({
            error
        });
    }
});

router.get('/getByIds', async (req, res) => {
    let id = '';
    if ('id' in req.query) id = req.query.id;
    const getIds = id.split(',');
    const products = await Product.find({ _id: getIds });
    if (!products) res.json({ data: [] });
    else res.json({ data: products });
});

module.exports = router;