const router = require('express').Router();
const Color = require('../schema').color;
const slugify = require('slugify');

router.get('/TableData', async (req, res) => {
    const colors = await Color.find({});
    if (!colors) res.json({data: []});
    else res.json({data: colors});
});

router.post('/add', async (req, res) => {
    const data = req.body;
    const newColor = new Color({
        name: data.name,
        slug: slugify(data.name, { lower: true }),
        price: data.price,
    });
    newColor.save();
    res.json({data: 'success'});
});

router.post('/update', async (req, res) => {
    const data = req.body;
    const color = await Color.findOne({_id: data._id});
    color.name = data.name;
    color.slug = slugify(data.name, { lower: true });
    color.price = data.price;
    color.save();
    res.json({data: 'success'});
});

router.get('/getByIds', async (req, res) => {
    let id = '';
    if ('id' in req.query) id = req.query.id;
    const getIds = id.split(',');
    const colors = await Color.find({_id: getIds});
    if (!colors) res.json({data: []});
    else res.json({data: colors});
});

router.post('/delete', async (req, res) => {
    await Color.deleteMany({_id: req.body.ids});
    res.json({data: 'success'});
});

module.exports = router;