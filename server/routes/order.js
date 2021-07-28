const router = require('express').Router();
const Order = require('../schema').order;
const User = require('../schema').user;
const Area = require('../schema').area;
const Discount = require('../schema').discount;
const crypto = require('crypto');
const firebaseFile = require('../firebase');
const firebase = firebaseFile.firebase;

router.get('/TableData', async (req, res) => {
    const orders = await Order.find({}).populate('area').populate({
        path: 'discount',
        populate: {
            path: 'products',
            populate: {
                path: 'item'
            }
        }
    });
    if (!orders) res.json({ data: [] });
    else res.json({ data: orders });
});

router.get('/getOrders', async (req, res) => {
    const orders = await Order.find({}, { _id: 0 });
    if (!orders) res.json({ data: [] });
    else res.json({ data: orders });
});

router.post('/set-status', async (req, res) => {
    const status = req.body.status;
    const selected = req.body.selected;
    await Order.updateMany({}, { 'status': status }).where('_id').in(selected);
    const orders = await Order.find({}).populate('area');
    res.json({ data: orders });
});

router.post('/confirmOrder', async (req, res) => {
    const data = req.body;
    let status = 'Pending';
    if (data.radioBoxes.method === 'Cash on Delivery') status = 'Pending Approval';
    const cartCookie = req.cookies['cart'];
    let orderNumber = null;
    while (orderNumber === null) {
        let tempOrderNumber = crypto.randomBytes(5).toString('hex');
        const orderExists = await Order.exists({ orderNumber: tempOrderNumber });
        if (!orderExists) orderNumber = tempOrderNumber;
    }
    const area = await Area.findOne({ name: data.area.value });
    const discount = data.discount;
    var sum = 0;
    for (var item in cartCookie.data) {
        const price = cartCookie.data[item]['totalPrice'];
        if (discount && discount.type === 'DIY' && cartCookie.data[item]['type'] === 'diy') {
            const discountedPrice = ((100 - discount.discountPercentage) / 100) * price;
            sum += discountedPrice;
        } else if (discount && discount.type === 'Product' && cartCookie.data[item]['type'] === 'product') {
            const discObj = discount.products.find(prod => cartCookie.data[item].item.name === prod.item.name);
            if (discObj) {
                const discountedPrice = ((100 - discObj.discountPercentage) / 100) * cartCookie.data[item].totalPrice;
                sum += discountedPrice;
            } else sum += cartCookie.data[item].totalPrice;
        } else sum += price;
    }
    const newOrder = new Order({
        orderNumber: orderNumber,
        firstName: data.firstName.value,
        lastName: data.lastName.value,
        phoneNumber: data.phoneNumber.value,
        email: data.email.value,
        firstName1: data.firstName1.value,
        lastName1: data.lastName1.value,
        phoneNumber1: data.phoneNumber1.value,
        email1: data.email1.value,
        area: area,
        addressLine1: data.addressLine1.value,
        landmark: data.landmark.value,
        addressLine2: data.addressLine2.value,
        deliveryDate: new Date(data.date.value),
        message: data.message.value,
        receiver: data.checkBoxes.receiver,
        callMe: data.checkBoxes.callMe,
        paymentMethod: data.radioBoxes.method,
        status: status,
        items: cartCookie.data,
        totalPrice: sum,
        numberOfItems: cartCookie.count
    });
    const user = firebase.auth().currentUser;
    if (user) {
        newOrder['user'] = await User.findOne({ uid: user.uid })
    }
    if (discount) {
        newOrder['discount'] = await Discount.findOne({ name: discount.name });
    }
    try {
        await newOrder.save();
        res.cookie('cart', '', { maxAge: 0, sameSite: 'lax' });
        res.json({ data: 'success' });
    } catch (error) {
        console.log(error);
        res.json({ data: 'fail' });
    }
});

router.post('/update', async (req, res) => {
    const data = req.body;
    console.log(data);
    // const order = await Order.findOne({_id: data._id});
    // order.name = data.name;
    // order.save();
    res.json({ data: 'success' });
});

router.get('/getByIds', async (req, res) => {
    let id = '';
    if ('id' in req.query) id = req.query.id;
    const getIds = id.split(',');
    const orders = await Order.find({ _id: getIds });
    if (!orders) res.json({ data: [] });
    else res.json({ data: orders });
});

router.post('/delete', async (req, res) => {
    // await Order.deleteMany({_id: req.body.ids});
    res.json({ data: 'success' });
});

module.exports = router;