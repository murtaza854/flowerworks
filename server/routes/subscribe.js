const router = require('express').Router();
const Subscribe = require('../schema').subscribe;
const dotenv = require('dotenv');
dotenv.config();

router.get('/getAllSubscribes', async (req, res) => {
    const subscribes = await Subscribe.find({});
    res.json({ data: subscribes });
});

router.get('/getAll-client', async (req, res) => {
    const subscribes = await Subscribe.find({ active: true });
    res.json({ data: subscribes });
});

router.get('/action', async (req, res) => {
    try {
        const ids = JSON.parse(req.query.ids);
        const updateString = req.query.updateString;
        const strings = updateString.split('_');
        const isTrueSet = (strings[1] === 'true');
        const subscribes = await Subscribe.find({ _id: { $in: ids } });
        subscribes.forEach(async subscribe => {
            subscribe[strings[0]] = isTrueSet;
            await subscribe.save();
        });
        res.json({ data: 'success' });
    } catch (error) {
        res.status(500).json({
            error
        });
    }
});

router.post('/add', async (req, res) => {
    const data = req.body;
    const subscribe = new Subscribe({
        packageLength: data.packageLength,
        packageLengthUnit: data.packageLengthUnit,
        base: data.base.name,
        baseAmount: data.baseAmount,
        price: data.price,
        active: data.active,
    });
    await subscribe.save();
    res.json({ data: true });
});

module.exports = router;