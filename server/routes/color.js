const router = require('express').Router();
const Color = require('../schema').color;
const slugify = require('slugify');

router.get('/TableData', async (req, res) => {
    const colors = await Color.find({});
    if (!colors) res.json({ data: [] });
    else res.json({ data: colors });
});

router.get('/getAllColors', async (req, res) => {
    const colors = await Color.find({});
    res.json({ data: colors });
});

router.get('/get-data', async (req, res) => {
    // const colors = [
    //     { name: 'Red', price: 100 },
    //     { name: 'Blue', price: 200 },
    //     { name: 'Green', price: 300 },
    // ];
    const colors = await Color.find({ active: true }, { _id: 0 });
    res.json({ data: colors });
});

router.post('/add', async (req, res) => {
    const data = req.body;
    const newColor = new Color({
        name: data.name,
        slug: slugify(data.name, { lower: true }),
        price: data.price,
        active: data.active
    });
    await newColor.save();
    res.json({ data: true });
});

router.post('/update', async (req, res) => {
    const data = req.body;
    const color = await Color.findOne({ _id: data.id });
    color.name = data.name;
    color.slug = slugify(data.name, { lower: true });
    color.price = data.price;
    color.active = data.active;
    await color.save();
    res.json({ data: true });
});

router.post('/getById', async (req, res) => {
    try {
        const color = await Color.findById(req.body.id);
        res.json({ data: color });
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
        const colors = await Color.find({ _id: { $in: ids } });
        colors.forEach(async color => {
            color[strings[0]] = isTrueSet;
            await color.save();
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
    const colors = await Color.find({ _id: getIds });
    if (!colors) res.json({ data: [] });
    else res.json({ data: colors });
});

router.post('/delete', async (req, res) => {
    await Color.deleteMany({ _id: req.body.ids });
    res.json({ data: 'success' });
});

module.exports = router;