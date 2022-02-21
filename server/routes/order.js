const router = require('express').Router();
const Order = require('../schema').order;
const Coupon = require('../schema').coupon;
const Size = require('../schema').size;
const Product = require('../schema').product;
const Addon = require('../schema').addon;
const Base = require('../schema').base;
const Color = require('../schema').color;
const Flower = require('../schema').flower;
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

router.get('/getAllOrders', async (req, res) => {
    const orders = await Order.find({}).populate({
        path: 'coupon',
        populate: {
            path: 'products addons',
        }
    });
    res.json({ data: orders });
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
    let status = 'Pending Payment';
    if (data.radioBoxes.method === 'Cash on Delivery') status = 'Processing';
    const cartCookie = req.cookies['cart'];
    let orderNumber = null;
    while (orderNumber === null) {
        let tempOrderNumber = crypto.randomBytes(5).toString('hex');
        const orderExists = await Order.exists({ orderNumber: tempOrderNumber });
        if (!orderExists) orderNumber = tempOrderNumber;
    }
    const coupons = await Coupon.find({ active: true }).populate({
        path: 'products',
        select: 'name slug -_id',
    }).populate({
        path: 'addons',
        select: 'name slug -_id',
    });
    let coupon = null;
    for (let i = 0; i < coupons.length; i++) {
        const couponFromArray = coupons[i];
        if (couponFromArray.redeemBy && new Date(couponFromArray.redeemBy) >= new Date()) {
            coupon = couponFromArray;
            break;
        }
    }
    if (!coupon && coupons.length > 0) coupon = coupons[0];
    let addonCouponSlugs = [];
    let productCouponSlugs = [];
    if (coupon && coupon.addons.length > 0) addonCouponSlugs = coupon.addons.map((add) => add.slug);
    if (coupon && coupon.products.length > 0) productCouponSlugs = coupon.products.map((prod) => prod.slug);
    for (let key in cartCookie) {
        const element = cartCookie[key];
        const slugsList = key.split('-.-.-');
        if (element.type === 'product') {
            const product = await Product.findOne({ slug: slugsList[0], active: true });
            if (product) {
                const sizes = product.sizes;
                let sizeDB = null;
                cartCookie[key].description = product.description;
                cartCookie[key].image = product.image;
                for (let i = 0; i < sizes.length; i++) {
                    const size = sizes[i];
                    if (size.name === slugsList[1]) {
                        sizeDB = size;
                        break;
                    }
                }
                if (sizeDB) {
                    cartCookie[key].size = sizeDB;
                } else {
                    delete cartCookie[key];
                }
            } else {
                delete cartCookie[key];
            }
        } else if (element.type === 'addon') {
            const addon = await Addon.findOne({ slug: slugsList[0], active: true });
            if (addon) {
                cartCookie[key].quantity = element.quantity;
                cartCookie[key].price = addon.price;
                cartCookie[key].image = addon.image;
            } else {
                delete cartCookie[key];
            }
        } else if (element.type === 'diy') {
            const sizeSlug = element.size.slug;
            const baseSlug = element.base.slug;
            const colorSlug = element.color.slug;
            const flowerSlugs = element.flowers.map(flower => flower.slug);
            const addonSlugs = element.addons.map(addon => addon.slug);
            const size = await Size.findOne({ slug: sizeSlug }, { _id: 0 });
            const base = await Base.findOne({ slug: baseSlug }, { _id: 0 });
            const color = await Color.findOne({ slug: colorSlug }, { _id: 0 });
            const flowers = await Flower.find({ slug: { $in: flowerSlugs } }, { _id: 0 });
            const addons = await Addon.find({ slug: { $in: addonSlugs } }, { _id: 0 });
            let flag = false;
            if (size && base && color) {
                flag = true;
            }
            if (flowers.length < 0) {
                flag = false;
            }
            if (addons.length < 0) {
                flag = false;
            }
            if (flag) {
                cartCookie[key].size = size;
                cartCookie[key].base = base;
                cartCookie[key].color = color;
                cartCookie[key].flowers = flowers;
                cartCookie[key].addons = addons;
            } else {
                delete cartCookie[key];
            }
        }
    }
    const prices = [];
    let couponFlag = false;
    for (const key in cartCookie) {
        const element = cart.cartObj[key];
        const quantity = element.quantity;
        let totalPrice = 0;
        let discountedPrice = null;
        if (element.type === 'product') {
            let unitPrice = element.size.price;
            totalPrice = element.size.price * quantity;
            if (coupon) {
                let flag = true;
                if (coupon.redeemBy && new Date(coupon.redeemBy) < new Date()) flag = false;
                if (coupon.maxRedemptions && coupon.maxRedemptions <= coupon.timesRedeeemed) flag = false;
                if (flag) {
                    if (coupon.appliedToProducts && productCouponSlugs.includes(element.productSlug)) {
                        if (coupon.type === 'Fixed Amount Discount') {
                            unitPrice = (unitPrice - coupon.amountOff) < 0 ? 0 : unitPrice - coupon.amountOff;
                            // discountedPrice = (totalPrice - coupon.amountOff) < 0 ? 0 : totalPrice - coupon.amountOff;
                            discountedPrice = unitPrice * quantity;
                        } else {
                            unitPrice = (unitPrice - (unitPrice * (coupon.percentOff / 100))).toFixed(2);
                            // discountedPrice = (totalPrice - (totalPrice * (coupon.percentOff / 100))).toFixed(2);
                            discountedPrice = unitPrice * quantity;
                        }
                    }
                }
            }
        } else if (element.type === 'addon') {
            let unitPrice = element.price;
            totalPrice = element.price * quantity;
            if (coupon) {
                let flag = true;
                if (coupon.redeemBy && new Date(coupon.redeemBy) < new Date()) flag = false;
                if (coupon.maxRedemptions && coupon.maxRedemptions <= coupon.timesRedeeemed) flag = false;
                if (flag) {
                    if (coupon.appliedToAddons && addonCouponSlugs.includes(element.addonSlug)) {
                        if (coupon.type === 'Fixed Amount Discount') {
                            unitPrice = (unitPrice - coupon.amountOff) < 0 ? 0 : unitPrice - coupon.amountOff;
                            // discountedPrice = (totalPrice - coupon.amountOff) < 0 ? 0 : totalPrice - coupon.amountOff;
                            discountedPrice = unitPrice * quantity;
                        } else {
                            unitPrice = (unitPrice - (unitPrice * (coupon.percentOff / 100))).toFixed(2);
                            // discountedPrice = (totalPrice - (totalPrice * (coupon.percentOff / 100))).toFixed(2);
                            discountedPrice = unitPrice * quantity;
                        }
                    }
                }
            }
        } else if (element.type === 'diy') {
            const totalFlowersPrice = element.flowers.reduce((acc, curr) => acc + curr.price, 0);
            const totalAddonsPrice = element.addons.reduce((acc, curr) => acc + curr.price, 0);
            let unitPrice = element.size.price + element.base.price + element.color.price + totalFlowersPrice + totalAddonsPrice;
            totalPrice = (element.size.price + element.base.price + element.color.price + totalFlowersPrice + totalAddonsPrice) * quantity;
            if (coupon) {
                let flag = true;
                if (coupon.redeemBy && new Date(coupon.redeemBy) < new Date()) flag = false;
                if (coupon.maxRedemptions && coupon.maxRedemptions <= coupon.timesRedeeemed) flag = false;
                if (flag) {
                    if (coupon.appliedToDIY) {
                        if (coupon.type === 'Fixed Amount Discount') {
                            unitPrice = (unitPrice - coupon.amountOff) < 0 ? 0 : unitPrice - coupon.amountOff;
                            // discountedPrice = (totalPrice - coupon.amountOff) < 0 ? 0 : totalPrice - coupon.amountOff;
                            discountedPrice = unitPrice * quantity;
                        } else {
                            unitPrice = (unitPrice - (unitPrice * (coupon.percentOff / 100))).toFixed(2);
                            // discountedPrice = (totalPrice - (totalPrice * (coupon.percentOff / 100))).toFixed(2);
                            discountedPrice = unitPrice * quantity;
                        }
                    }
                }
            }
        }
        if (discountedPrice !== null) {
            prices.push(discountedPrice);
            couponFlag = true;
        } else prices.push(totalPrice);
    }
    const finalPrice = prices.reduce((acc, curr) => acc + curr, 0);
    if (couponFlag && coupon) {
        if (coupon.minAmount > finalPrice) {
            coupon = null;
        }
    }
    const newOrder = new Order({
        orderNumber: orderNumber,
        firstName: data.deliveryDetails.firstName,
        lastName: data.deliveryDetails.lastName,
        phoneNumber: data.deliveryDetails.phoneNumber,
        email: data.deliveryDetails.email,
        firstName1: data.deliveryDetails.firstName1,
        lastName1: data.deliveryDetails.lastName1,
        phoneNumber1: data.deliveryDetails.phoneNumber1,
        email1: data.deliveryDetails.email1,
        area: data.deliveryDetails.area,
        addressLine1: data.deliveryDetails.addressLine1,
        addressLine2: data.deliveryDetails.addressLine2,
        deliveryDate: new Date(data.deliveryDetails.date),
        message: data.deliveryDetails.message,
        receiver: data.deliveryDetails.checkBoxes.receiver,
        callMe: data.deliveryDetails.checkBoxes.callMe,
        paymentMethod: data.radioBoxes.method,
        landmark: data.deliveryDetails.landmark,
        status: status,
        items: cartCookie,
        coupon: coupon
    });
    try {
        await newOrder.save();
        res.cookie('cart', '', { maxAge: 0, sameSite: 'lax' });
        res.json({ data: 'success', orderNumber });
    } catch (error) {
        res.json({ data: 'fail' });
    }
});

router.get('/action', async (req, res) => {
    try {
        const ids = JSON.parse(req.query.ids);
        const updateString = req.query.updateString;
        const strings = updateString.split('_');
        let isTrueSet = strings[1];
        if (strings[0] !== 'status') {
            isTrueSet = (strings[1] === 'true');
        }
        const orders = await Order.find({ _id: { $in: ids } });
        orders.forEach(async order => {
            order[strings[0]] = isTrueSet;
            await order.save();
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
    const orders = await Order.find({ _id: getIds });
    if (!orders) res.json({ data: [] });
    else res.json({ data: orders });
});

router.post('/delete', async (req, res) => {
    // await Order.deleteMany({_id: req.body.ids});
    res.json({ data: 'success' });
});

module.exports = router;