const router = require('express').Router();
const Flower = require('../schema').flower;
const slugify = require('slugify');

router.get('/TableData', async (req, res) => {
    const flowers = await Flower.find({});
    if (!flowers) res.json({ data: [] });
    else res.json({ data: flowers });
});

router.get('/getAllFlowers', async (req, res) => {
    const flowers = await Flower.find({});
    res.json({ data: flowers });
});

router.get('/get-data', async (req, res) => {
    // const flowers = [
    //     { name: 'Rose', price: 100 },
    //     { name: 'Lily', price: 200 },
    //     { name: 'Tulip', price: 300 },
    //     { name: 'Orchid', price: 400 },
    //     { name: 'Carnation', price: 500 },
    //     { name: 'Freesia', price: 600 },
    //     { name: 'Hyacinth', price: 700 },
    //     { name: 'Peruvian Lily', price: 800 },
    //     { name: 'Chrysanthemum', price: 900 },
    //     { name: 'Gladiolus', price: 1000 },
    //     { name: 'Anemone', price: 1100 },
    //     { name: 'Daffodil', price: 1200 },
    //     { name: 'Poppy', price: 1300 },
    //     { name: 'Sunflower', price: 1400 },
    // ];
    const flowers = await Flower.find({ active: true }, { _id: 0 });
    res.json({ data: flowers });
});

router.post('/add', async (req, res) => {
    const data = req.body;
    const newFlower = new Flower({
        name: data.name,
        slug: slugify(data.name, { lower: true }),
        price: data.price,
        active: data.active
    });
    await newFlower.save();
    res.json({ data: true });
});

router.post('/update', async (req, res) => {
    const data = req.body;
    const flower = await Flower.findOne({ _id: data.id });
    flower.name = data.name;
    flower.slug = slugify(data.name, { lower: true });
    flower.price = data.price;
    flower.active = data.active;
    await flower.save();
    res.json({ data: true });
});

router.post('/getById', async (req, res) => {
    try {
        const flower = await Flower.findById(req.body.id);
        res.json({ data: flower });
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
        const flowers = await Flower.find({ _id: { $in: ids } });
        flowers.forEach(async flower => {
            flower[strings[0]] = isTrueSet;
            await flower.save();
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
    const flowers = await Flower.find({ _id: getIds });
    if (!flowers) res.json({ data: [] });
    else res.json({ data: flowers });
});

router.post('/delete', async (req, res) => {
    await Flower.deleteMany({ _id: req.body.ids });
    res.json({ data: 'success' });
});

module.exports = router;