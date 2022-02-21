const router = require('express').Router();
const Base = require('../schema').base;
const Product = require('../schema').product;
const multer = require('multer');
const fs = require('fs');
const slugify = require('slugify');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // cb(null, path.resolve('../client/public/bases'));
        cb(null, path.resolve('./build/bases'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + Date.now() + ext);
    }
});

var upload = multer({ storage: storage });

router.get('/getAllBases', async (req, res) => {
    const bases = await Base.find({});
    res.json({ data: bases });
});

router.get('/client-getAll', async (req, res) => {
    const bases = await Base.find({ active: true }, { _id: 0 });
    res.json({ data: bases });
});

router.get('/get-data', async (req, res) => {
    const bases = await Base.find({ active: true }, { _id: 0 });
    res.json({ data: bases });
});

router.post('/add', upload.single('image'), async (req, res) => {
    try {
        const data = JSON.parse(req.body.data);
        const base = new Base({
            name: data.name,
            slug: slugify(data.name, { lower: true }),
            price: data.price,
            image: '/bases/' + req.file.filename,
            fileName: req.file.filename,
            active: data.active
        });
        await base.save();
        res.json({ data: base });
    } catch (error) {
        res.json({ data: null, error: error });
    }
});

router.post('/update', upload.single('image'), async (req, res) => {
    const file = req.file;
    const data = JSON.parse(req.body.data);
    try {
        const base = await Base.findById(data.id);
        base.name = data.name;
        base.slug = slugify(data.name, { lower: true });
        base.price = data.price;
        if (file) {
            // fs.unlinkSync(path.resolve('../client/public/bases/' + base.fileName));
            fs.unlinkSync(path.resolve('./build/bases/' + base.fileName));
            base.fileName = file.filename;
            base.image = '/bases/' + file.filename;
        }
        base.active = data.active;
        await base.save();
        res.json({ data: true });
    } catch (error) {
        res.json({ data: null, error: error });
    }
});

router.post('/getById', async (req, res) => {
    try {
        const base = await Base.findById(req.body.id);
        res.json({ data: base });
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
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            const base = await Base.findById(id);
            if (strings[0] === 'active') base.active = isTrueSet;
            await base.save();
        }
        res.json({ data: 'success' });
    } catch (error) {
        res.status(500).json({
            error
        });
    }
});

module.exports = router;