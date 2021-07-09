const router = require('express').Router();
const Order = require('../schema').order;

router.get('/TableData', async (req, res) => {
    const orders = await Order.find({});
    if (!orders) res.json({data: []});
    else res.json({data: orders});
});

router.get('/getOrders', async (req, res) => {
    const orders = await Order.find({}, {_id: 0});
    if (!orders) res.json({data: []});
    else res.json({data: orders});
});

router.post('/confirmOrder', async (req, res) => {
    const data = req.body;
    let status = 'Pending Payment';
    if (data.radioBoxes.method === 'Cash on Delivery') status = 'Pending Approval';
    const newOrder = new Order({
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        firstName1: data.firstName1,
        lastName1: data.lastName1,
        phoneNumber1: data.phoneNumber1,
        email1: data.email1,
        area: data.area,
        addressLine1: data.addressLine1,
        landmark: data.landmark,
        addressLine2: data.addressLine2,
        date: new Date(data.date),
        message: data.message,
        receiver: data.checkBoxes.receiver,
        callMe: data.checkBoxes.callMe,
        paymentMethod: data.radioBoxes.method,
        status: status
    });
    try {
        newOrder.save();
        res.cookie('cart', '', {maxAge: 0, sameSite: 'lax'});
        res.json({data: 'success'});
    } catch (error) {
        res.json({data: 'fail'});
    }
});

router.post('/update', async (req, res) => {
    const data = req.body;
    console.log(data);
    // const order = await Order.findOne({_id: data._id});
    // order.name = data.name;
    // order.save();
    res.json({data: 'success'});
});

router.get('/getByIds', async (req, res) => {
    let id = '';
    if ('id' in req.query) id = req.query.id;
    const getIds = id.split(',');
    const orders = await Order.find({_id: getIds});
    if (!orders) res.json({data: []});
    else res.json({data: orders});
});

router.post('/delete', async (req, res) => {
    // await Order.deleteMany({_id: req.body.ids});
    res.json({data: 'success'});
});

module.exports = router;