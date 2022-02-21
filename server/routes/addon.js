const router = require('express').Router();
const Addon = require('../schema').addon;
const Coupon = require('../schema').coupon;
const slugify = require('slugify')
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // cb(null, path.resolve('../client/public/addons'));
        cb(null, path.resolve('./build/addons'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + Date.now() + ext);
    }
});

var upload = multer({ storage: storage });

router.get('/getAllAddons', async (req, res) => {
    const addons = await Addon.find({});
    res.json({ data: addons });
});

router.get('/get-data', async (req, res) => {
    const addons = await Addon.find({ active: true }, { _id: 0 });
    res.json({ data: addons });
})

router.post('/getById', async (req, res) => {
    try {
        const addon = await Addon.findById(req.body.id);
        res.json({ data: addon });
    } catch (error) {
        res.json({ data: null, error: error });
    }
});

router.get('/getAddonsThree', async (req, res) => {
    const addons = await Addon.aggregate([{ $sample: { size: 3 } }, { $project: { _id: 0, description: 0 } }]);
    const activeAddons = [];
    for (let i = 0; i < addons.length; i++) {
        const element = addons[i];
        if (element.active) {
            activeAddons.push(element);
        }
    }
    const coupons = await Coupon.find({ active: true }, { _id: 0, products: 0 }).populate({
        path: 'addons',
        select: 'name slug -_id',
    });
    res.json({ data: activeAddons, coupons });
});

router.post('/add', upload.single('image'), async (req, res) => {
    const data = JSON.parse(req.body.data);
    const image = req.file;
    try {
        let slug = slugify(data.name, { lower: true });
        while (true) {
            const addon = await Addon.findOne({ slug: slug });
            if (addon) {
                if (parseInt(addon.slug.split('-')[1]) > 0) {
                    slug = slug + '-' + parseInt(addon.slug.split('-')[1]) + 1;
                } else {
                    slug = slug + '-1';
                }
            } else {
                break;
            }
        }
        const primaryImagePath = '/addons/' + image.filename;
        const newAddon = new Addon({
            name: data.name,
            slug: slug,
            price: data.price,
            image: primaryImagePath,
            fileName: image.filename,
            active: data.active
        });
        await newAddon.save();
        res.json({ data: true });
    } catch (error) {
        res.json({ data: null, error: error });
    }
});

router.post('/update', upload.single('image'), async (req, res) => {
    const file = req.file;
    const data = JSON.parse(req.body.data);
    try {
        const addon = await Addon.findById(data.id);
        if (addon.name !== data.name) {
            let slug = slugify(data.name, { lower: true });
            while (true) {
                const addon = await Addon.findOne({ slug: slug });
                if (addon) {
                    if (parseInt(addon.slug.split('-')[1]) > 0) {
                        slug = slug + '-' + parseInt(addon.slug.split('-')[1]) + 1;
                    } else {
                        slug = slug + '-1';
                    }
                } else {
                    break;
                }
            }
            addon.name = data.name;
            addon.slug = slug;
        }
        addon.price = data.price;
        if (file) {
            // fs.unlinkSync(path.resolve('../client/public/addons/' + addon.fileName));
            fs.unlinkSync(path.resolve('./build/addons/' + addon.fileName));
            addon.fileName = file.filename;
            addon.image = '/addons/' + file.filename;
        }
        addon.active = data.active;
        await addon.save();
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
        const addons = await Addon.find({ _id: { $in: ids } });
        addons.forEach(async addon => {
            addon[strings[0]] = isTrueSet;
            await addon.save();
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
    const addons = await Addon.find({ _id: getIds });
    if (!addons) res.json({ data: [] });
    else res.json({ data: addons });
});

module.exports = router;