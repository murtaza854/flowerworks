const router = require('express').Router();
const Size = require('../schema').size;
const slugify = require('slugify');

router.get('/TableData', async (req, res) => {
    const sizes = await Size.find({});
    if (!sizes) res.json({ data: [] });
    else res.json({ data: sizes });
});

router.get('/getAllSizes', async (req, res) => {
    const sizes = await Size.find({});
    res.json({ data: sizes });
});

router.get('/get-data', async (req, res) => {
    // const sizes = [
    //     { name: 'small', price: 100 },
    //     { name: 'medium', price: 200 },
    //     { name: 'large', price: 300 },
    // ];
    const sizes = await Size.find({ active: true }, { _id: 0 });
    res.json({ data: sizes });
});

router.post('/add', async (req, res) => {
    const data = req.body;
    const newSize = new Size({
        name: data.name,
        slug: slugify(data.name, { lower: true }),
        price: data.price,
        active: data.active
    });
    await newSize.save();
    res.json({ data: true });
});

router.post('/update', async (req, res) => {
    const data = req.body;
    const size = await Size.findOne({ _id: data.id });
    size.name = data.name;
    size.slug = slugify(data.name, { lower: true });
    size.price = data.price;
    size.active = data.active;
    await size.save();
    res.json({ data: true });
});

router.post('/getById', async (req, res) => {
    try {
        const size = await Size.findById(req.body.id);
        res.json({ data: size });
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
        const sizes = await Size.find({ _id: { $in: ids } });
        sizes.forEach(async size => {
            size[strings[0]] = isTrueSet;
            await size.save();
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
    const sizes = await Size.find({ _id: getIds });
    if (!sizes) res.json({ data: [] });
    else res.json({ data: sizes });
});

router.post('/delete', async (req, res) => {
    await Size.deleteMany({ _id: req.body.ids });
    res.json({ data: 'success' });
});

module.exports = router;