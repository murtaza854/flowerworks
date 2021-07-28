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

router.post('/addToCart', async (req, res) => {
    const cartCookie = req.cookies['cart'];
    if (cartCookie) {
        const cartObj = {
            data: cartCookie.data,
            count: cartCookie.count,
            cartTotalPrice: cartCookie.cartTotalPrice
        }
        if (req.body.productSlug && req.body.productSlug in cartObj.data) {
            const itemPrice = cartObj.data[`${req.body.productSlug}`].item.price;
            cartObj.data[`${req.body.productSlug}`]['count'] += 1;
            cartObj.data[`${req.body.productSlug}`].totalPrice += itemPrice;
            cartObj.cartTotalPrice += itemPrice;
        } else if (req.body.productSlug) {
            const product = await Product.findOne({slug: req.body.productSlug}, {_id: 0, base: 0, slug: 0});
            cartObj.data[`${req.body.productSlug}`] = {
                item: product,
                count: 1,
                totalPrice: product.price,
                type: 'product'
            };
            cartObj.cartTotalPrice += product.price;
        } else if (req.body.addonSlug && req.body.addonSlug in cartObj.data) {
            const itemPrice = cartObj.data[`${req.body.addonSlug}`].item.price;
            cartObj.data[`${req.body.addonSlug}`]['count'] += 1;
            cartObj.data[`${req.body.addonSlug}`].totalPrice += itemPrice
            cartObj.cartTotalPrice += itemPrice;
        } else if (req.body.addonSlug) {
            const addon = await Addon.findOne({slug: req.body.addonSlug}, {_id: 0, base: 0, slug: 0});
            cartObj.data[`${req.body.addonSlug}`] = {
                item: addon,
                count: 1,
                totalPrice: addon.price,
                type: 'addon'
            };
            cartObj.cartTotalPrice += addon.price;
        } else if(req.body.diy) {
            const diy = req.body.diy;
            const size = diy.size;
            const base = diy.base;
            const color = diy.color;
            const flowerCheckbox = diy.flowerCheckbox;
            const addonCheckbox = diy.addonCheckbox;
            const flowerArray = diy.flowerArray;
            const addonArray = diy.addonArray;
            const cost = diy.cost;
            const finalFlowerArray = [];
            for (let index = 0; index < flowerCheckbox.length; index++) {
                const bool = flowerCheckbox[index];
                const flower = flowerArray[index];
                if (bool) finalFlowerArray.push(flower);
            }
            const finalAddonArray = [];
            for (let index = 0; index < addonCheckbox.length; index++) {
                const bool = addonCheckbox[index];
                const addon = addonArray[index];
                if (bool) finalAddonArray.push(addon);
            }
            cartObj.data[`diy-${Object.keys(cartObj.data).length + 1}`] = {
                item: {
                    name: 'Do it Yourself',
                    imagePath: '/products/515.jpg',
                    size: size,
                    base: base,
                    color: color,
                    flowers: finalFlowerArray,
                    addons: finalAddonArray,
                    price: cost
                },
                count: 1,
                totalPrice: cost,
                type: 'diy'
            };
            cartObj.cartTotalPrice += cost;
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
        } else if (req.query.diySlug && req.query.diySlug in cartObj.data) {
            const itemPrice = cartObj.data[`${req.query.diySlug}`].item.price;
            cartObj.data[`${req.query.diySlug}`]['count'] -= 1;
            cartObj.data[`${req.query.diySlug}`].totalPrice -= itemPrice
            cartObj.cartTotalPrice -= itemPrice;
            if (cartObj.data[`${req.query.diySlug}`]['count'] === 0) delete cartObj.data[`${req.query.diySlug}`];
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
        } else if (req.query.diySlug && req.query.diySlug in cartObj.data) {
            const itemPrice = cartObj.data[`${req.query.diySlug}`].item.price;
            cartObj.data[`${req.query.diySlug}`]['count'] += 1;
            cartObj.data[`${req.query.diySlug}`].totalPrice += itemPrice
            cartObj.cartTotalPrice += itemPrice;
        }
        cartObj.count = Object.keys(cartObj.data).length;
        const expiryDate = new Date(Number(new Date()) + 315360000000); 
        await res.cookie("cart", cartObj, {httpOnly: true, maxAge: expiryDate, sameSite: 'lax'});
        res.json({data: cartObj});
    }
});


module.exports = router;