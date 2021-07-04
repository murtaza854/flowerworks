const router = require('express').Router();
const Product = require('../schema').product;
const Addon = require('../schema').addon;
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

router.get('/getCart', async (req, res) => {
    const cartCookie = req.cookies['cart'];
    const cartObj = {
        data: {},
        count: 0,
        cartTotalPrice: 0
    }
    if (!cartCookie) {
        const expiryDate = new Date(Number(new Date()) + 315360000000); 
        await res.cookie("cart", cartObj, {httpOnly: true, maxAge: expiryDate, sameSite: 'lax'});
        res.json({data: cartObj});
    } else {
        res.json({data: cartCookie})
    };
});

router.get('/addToCart', async (req, res) => {
    const cartCookie = req.cookies['cart'];
    if (cartCookie) {
        const cartObj = {
            data: cartCookie.data,
            count: cartCookie.count,
            cartTotalPrice: cartCookie.cartTotalPrice
        }
        if (req.query.productSlug && req.query.productSlug in cartObj.data) {
            const itemPrice = cartObj.data[`${req.query.productSlug}`].item.price;
            cartObj.data[`${req.query.productSlug}`]['count'] += 1;
            cartObj.data[`${req.query.productSlug}`].totalPrice += itemPrice;
            cartObj.cartTotalPrice += itemPrice;
        } else if (req.query.productSlug) {
            const product = await Product.findOne({slug: req.query.productSlug}, {_id: 0, base: 0, slug: 0});
            cartObj.data[`${req.query.productSlug}`] = {
                item: product,
                count: 1,
                totalPrice: product.price,
                type: 'product'
            };
            cartObj.cartTotalPrice += product.price;
        } else if (req.query.addonSlug && req.query.addonSlug in cartObj.data) {
            const itemPrice = cartObj.data[`${req.query.addonSlug}`].item.price;
            cartObj.data[`${req.query.addonSlug}`]['count'] += 1;
            cartObj.data[`${req.query.addonSlug}`].totalPrice += itemPrice
            cartObj.cartTotalPrice += itemPrice;
        } else if (req.query.addonSlug) {
            const addon = await Addon.findOne({slug: req.query.addonSlug}, {_id: 0, base: 0, slug: 0});
            cartObj.data[`${req.query.addonSlug}`] = {
                item: addon,
                count: 1,
                totalPrice: addon.price,
                type: 'addon'
            };
            cartObj.cartTotalPrice += addon.price;
        }
        cartObj.count = Object.keys(cartObj.data).length;
        const expiryDate = new Date(Number(new Date()) + 315360000000); 
        await res.cookie("cart", cartObj, {httpOnly: true, maxAge: expiryDate, sameSite: 'lax'});
        res.json({data: cartObj});
    }
});

router.get('/removeItem', async (req, res) => {
    const cartCookie = req.cookies['cart'];
    if (cartCookie) {
        const cartObj = {
            data: cartCookie.data,
            count: cartCookie.count,
            cartTotalPrice: cartCookie.cartTotalPrice
        }
        if (req.query.productSlug && req.query.productSlug in cartObj.data) {
            const itemPrice = cartObj.data[`${req.query.productSlug}`].item.price;
            cartObj.data[`${req.query.productSlug}`]['count'] -= 1;
            cartObj.data[`${req.query.productSlug}`].totalPrice -= itemPrice
            cartObj.cartTotalPrice -= itemPrice;
            if (cartObj.data[`${req.query.productSlug}`]['count'] === 0) delete cartObj.data[`${req.query.productSlug}`];
        } else if (req.query.addonSlug && req.query.addonSlug in cartObj.data) {
            const itemPrice = cartObj.data[`${req.query.addonSlug}`].item.price;
            cartObj.data[`${req.query.addonSlug}`]['count'] -= 1;
            cartObj.data[`${req.query.addonSlug}`].totalPrice -= itemPrice
            cartObj.cartTotalPrice -= itemPrice;
            if (cartObj.data[`${req.query.addonSlug}`]['count'] === 0) delete cartObj.data[`${req.query.addonSlug}`];
        }
        cartObj.count = Object.keys(cartObj.data).length;
        const expiryDate = new Date(Number(new Date()) + 315360000000); 
        await res.cookie("cart", cartObj, {httpOnly: true, maxAge: expiryDate, sameSite: 'lax'});
        res.json({data: cartObj});
    }
});

router.get('/addItem', async (req, res) => {
    const cartCookie = req.cookies['cart'];
    if (cartCookie) {
        const cartObj = {
            data: cartCookie.data,
            count: cartCookie.count,
            cartTotalPrice: cartCookie.cartTotalPrice
        }
        if (req.query.productSlug && req.query.productSlug in cartObj.data) {
            const itemPrice = cartObj.data[`${req.query.productSlug}`].item.price;
            cartObj.data[`${req.query.productSlug}`]['count'] += 1;
            cartObj.data[`${req.query.productSlug}`].totalPrice += itemPrice
            cartObj.cartTotalPrice += itemPrice;
        } else if (req.query.addonSlug && req.query.addonSlug in cartObj.data) {
            const itemPrice = cartObj.data[`${req.query.addonSlug}`].item.price;
            cartObj.data[`${req.query.addonSlug}`]['count'] += 1;
            cartObj.data[`${req.query.addonSlug}`].totalPrice += itemPrice
            cartObj.cartTotalPrice += itemPrice;
        }
        cartObj.count = Object.keys(cartObj.data).length;
        const expiryDate = new Date(Number(new Date()) + 315360000000); 
        await res.cookie("cart", cartObj, {httpOnly: true, maxAge: expiryDate, sameSite: 'lax'});
        res.json({data: cartObj});
    }
});


module.exports = router;