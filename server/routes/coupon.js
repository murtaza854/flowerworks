const router = require('express').Router();
const Coupon = require('../schema').coupon;
const Product = require('../schema').product;
const Addon = require('../schema').addon;

router.get('/getAllCoupons', async (req, res) => {
    try {
        const coupons = await Coupon.find({});
        res.json({ data: coupons });
    } catch (error) {
        res.status(500).json({
            error
        });
    }
});

router.get('/getCoupons-client', async (req, res) => {
    try {
        const coupons = await Coupon.find({ active: true }, { _id: 0, products: 0, addons: 0 });
        res.json({ coupons });
    } catch (error) {
        res.status(500).json({
            error
        });
    }
});

router.get('/getCoupons-client-includeAll', async (req, res) => {
    try {
        const coupons = await Coupon.find({ active: true }, { _id: 0 }).populate({
            path: 'products',
            select: 'name slug -_id',
        }).populate({
            path: 'addons',
            select: 'name slug -_id',
        });
        res.json({ coupons });
    } catch (error) {
        res.status(500).json({
            error
        });
    }
});


router.get('/getAllCouponsPromotionFlag', async (req, res) => {
    try {
        const coupons = await Coupon.find({ hasPromotionCodes: true });
        res.json({ data: coupons });
    } catch (error) {
        res.status(500).json({
            error
        });
    }
});

router.post('/add', async (req, res) => {
    const {
        name,
        type,
        value,
        usageLimit,
        redeemBy,
        appliedToProducts,
        appliedToAddons,
        appliedToDIY,
        products,
        addons,
        minAmount,
        active
    } = req.body;
    const params = {
        name,
        type,
        appliedToProducts,
        appliedToAddons,
        appliedToDIY,
        minAmount: minAmount,
        timesRedeeemed: 0,
        active
    };
    if (type === 'Percentage Discount') {
        params.percentOff = parseFloat(value);
    } else if (type === 'Fixed Amount Discount') {
        params.amountOff = parseInt(value);
    }
    if (redeemBy) {
        params.redeemBy = new Date(redeemBy);
    }
    if (usageLimit) {
        params.maxRedemptions = parseInt(usageLimit);
    }
    if (appliedToProducts) {
        const productIds = products.map(product => product.value);
        const dbProducts = await Product.find({ _id: { $in: productIds } });
        params.products = dbProducts;
    }
    if (appliedToAddons) {
        const addonIds = addons.map(addon => addon.value);
        const dbAddons = await Addon.find({ _id: { $in: addonIds } });
        params.addons = dbAddons;
    }
    const coupon = new Coupon(params);
    await coupon.save()
    res.json({ data: coupon });
});

router.post('/getById', async (req, res) => {
    const { id } = req.body;
    const coupon = await couponController.getById(id);
    res.json({ data: coupon });
});

router.post('/update', async (req, res) => {
    const {
        name,
        usageLimit,
        redeemBy,
        appliedToProducts,
        products,
        promotionCodes
    } = req.body;
    const params = {
        name,
    };
    if (redeemBy) {
        params.redeem_by = new Date(redeemBy);
    }
    if (usageLimit) {
        params.max_redemptions = parseInt(usageLimit);
    }
    if (appliedToProducts) {
        params.applies_to = {};
        params.applies_to.products = products.map(product => product.id);
    }
    const coupon = await stripe.coupons.update(req.body.id, params);
    const couponDb = await couponController.update({
        id: coupon.id,
        name: coupon.name,
        redeemBy: redeemBy ? new Date(redeemBy) : null,
        maxRedemptions: usageLimit ? parseInt(usageLimit) : null,
        appliedToProducts: appliedToProducts,
        hasPromotionCodes: promotionCodes,
    });
    res.json({ data: couponDb });
});


module.exports = router;