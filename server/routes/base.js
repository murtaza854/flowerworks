const router = require('express').Router();
const Base = require('../schema').base;
const Product = require('../schema').product;
const multer = require('multer');
const fs = require('fs');
const slugify = require('slugify');

const storage = multer.diskStorage({
    destination: '../client/public/bases',
    filename: (req, file, cb) => {
      cb(null, `${file.originalname}`);
    }
});
    
var upload = multer({storage: storage});

router.get('/TableData', async (req, res) => {
    if ('excludeID' in req.query) bases = await Base.find({}, {_id: 0});
    else  bases = await Base.find({});
    if (!bases) res.json({data: []});
    else res.json({data: bases});
});

router.post('/add', upload.single('file'), async (req, res) => {
    const file = req.file;
    if (file) {
        const data = JSON.parse(req.body.data);
        const newBase = new Base({
            name: data.name,
            slug: slugify(data.name, { lower: true }),
            price: data.price,
            imagePath: `/bases/${file.filename}`
        });
        newBase.save();
        res.json({data: 'success'});
    } else {
        res.json({data: 'failed'});
    }
});

router.post('/update', upload.single('file'), async (req, res) => {
    const file = req.file;
    const data = JSON.parse(req.body.data);
    const base = await Base.findOne({_id: data._id});
    base.name = data.name;
    base.slug = slugify(data.name, { lower: true });
    base.price = data.price;
    if (file) {
        try {
            await fs.unlinkSync(`../client/public${base.imagePath}`);
            base.imagePath = `/bases/${file.filename}`;
        } catch (error) {
            console.error('there was an error:', error.message);
        }
    }
    base.save();
    res.json({data: 'success'});
});

router.get('/getByIds', async (req, res) => {
    let id = '';
    if ('id' in req.query) id = req.query.id;
    const getIds = id.split(',');
    const bases = await Base.find({_id: getIds});
    const merged = [];
    for (let i = 0; i < bases.length; i++) {
        const base = bases[i];
        const products = await Product.find({base: base});
        merged.push({
            name: base.name,
            products:products
        });
    }
    if (!merged) res.json({data: []});
    else res.json({data: merged});
});

router.post('/delete', async (req, res) => {
    const bases = await Base.find({_id: req.body.ids});
    bases.forEach(async base => {
        const products = await Product.find({base: base});
        products.forEach(async product => {
            try {
                await fs.unlinkSync(`../client/public${product.imagePath}`);
            } catch (error) {
                console.error('there was an error:', error.message);
            }
        });
        await Product.deleteMany({base: base});
        try {
            await fs.unlinkSync(`../client/public${base.imagePath}`);
        } catch (error) {
            console.error('there was an error:', error.message);
        }
    });
    await Base.deleteMany({_id: req.body.ids});
    res.json({data: 'success'});
});

module.exports = router;