const router = require('express').Router();
const Flower = require('../schema').flower;
const slugify = require('slugify');

router.get('/TableData', async (req, res) => {
    const flowers = await Flower.find({});
    if (!flowers) res.json({data: []});
    else res.json({data: flowers});
});

router.post('/add', async (req, res) => {
    const data = req.body;
    const newFlower = new Flower({
        name: data.name,
        slug: slugify(data.name, { lower: true }),
        price: data.price,
    });
    newFlower.save();
    res.json({data: 'success'});
});

router.post('/update', async (req, res) => {
    const data = req.body;
    const flower = await Flower.findOne({_id: data._id});
    flower.name = data.name;
    flower.slug = slugify(data.name, { lower: true });
    flower.price = data.price;
    flower.save();
    res.json({data: 'success'});
});

router.get('/getByIds', async (req, res) => {
    let id = '';
    if ('id' in req.query) id = req.query.id;
    const getIds = id.split(',');
    const flowers = await Flower.find({_id: getIds});
    if (!flowers) res.json({data: []});
    else res.json({data: flowers});
});

router.post('/delete', async (req, res) => {
    await Flower.deleteMany({_id: req.body.ids});
    res.json({data: 'success'});
});

module.exports = router;