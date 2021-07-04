const router = require('express').Router();
const Addon = require('../schema').addon;
const slugify = require('slugify')
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: '../client/public/addons',
    filename: (req, file, cb) => {
      cb(null, `${file.originalname}`);
    }
});
    
var upload = multer({storage: storage});

router.get('/TableData', async (req, res) => {
    const addons = await Addon.find({});
    if (!addons) res.json({data: []});
    else res.json({data: addons});
});

router.get('/getAddonsThree', async (req, res) => {
    const addons = await Addon.aggregate([{ $sample: { size: 3 } }, {$project: {_id: 0 , description: 0} }]);
    if (!addons) res.json({data: []});
    else res.json({data: addons});
});

router.post('/add', upload.single('file'), async (req, res) => {
    const file = req.file;
    if (file) {
        const data = JSON.parse(req.body.data);
        const newAddon = new Addon({
            name: data.name,
            slug: slugify(data.name, { lower: true }),
            description: data.description,
            price: data.price,
            imagePath: `/addons/${file.filename}`,
        });
        newAddon.save();
        res.json({data: 'success'});
    } else {
        res.json({data: 'failed'});
    }
});

router.post('/update', upload.single('file'), async (req, res) => {
    const file = req.file;
    const data = JSON.parse(req.body.data);
    const addon = await Addon.findOne({_id: data._id});
    addon.name = data.name;
    addon.slug = slugify(data.name, { lower: true });
    addon.description = data.description;
    addon.price = data.price;
    if (file) {
        try {
            await fs.unlinkSync(`../client/public${addon.imagePath}`);
            addon.imagePath = `/addons/${file.filename}`;
        } catch (error) {
            console.error('there was an error:', error.message);
        }
    }
    addon.save();
    res.json({data: 'success'});
});

router.get('/getByIds', async (req, res) => {
    let id = '';
    if ('id' in req.query) id = req.query.id;
    const getIds = id.split(',');
    const addons = await Addon.find({_id: getIds});
    if (!addons) res.json({data: []});
    else res.json({data: addons});
});

router.post('/delete', async (req, res) => {
    const addons = await Addon.find({_id: req.body.ids});
    addons.forEach(async addon => {
        try {
            await fs.unlinkSync(`../client/public${addon.imagePath}`);
        } catch (error) {
            console.error('there was an error:', error.message);
        }
    });
    await Addon.deleteMany({_id: req.body.ids});
    res.json({data: 'success'});
});

module.exports = router;