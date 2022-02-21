const router = require('express').Router();
// const Product = require('../schema').product;
const Base = require('../schema').base;
const Product = require('../schema').product;
const Addon = require('../schema').addon;
const Size = require('../schema').size;
const Color = require('../schema').color;
const Flower = require('../schema').flower;
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

router.get('/getCart', async (req, res) => {
    const cartCookie = req.cookies['cart'];
    const cartObj = {}
    if (!cartCookie) {
        const expiryDate = new Date(Number(new Date()) + 315360000000);
        await res.cookie("cart", cartObj, { httpOnly: true, maxAge: expiryDate, sameSite: 'lax' });
        res.json({ data: cartObj });
    } else {
        delete cartCookie['data'];
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
        const expiryDate = new Date(Number(new Date()) + 315360000000);
        await res.cookie("cart", cartCookie, { httpOnly: true, maxAge: expiryDate, sameSite: 'lax' });
        res.json({ data: cartCookie })
    };
});

router.post('/addToCart', async (req, res) => {
    const cartCookie = req.cookies['cart'];
    if (cartCookie) {
        const cartObj = cartCookie;
        if (req.body.type === 'product') {
            let key = `${req.body.productSlug}-.-.-${req.body.size.name}-.-.-product`;
            if (cartObj[key]) {
                cartObj[key].quantity += 1;
            } else {
                cartObj[key] = {
                    name: req.body.name,
                    productSlug: req.body.productSlug,
                    description: req.body.description,
                    quantity: 1,
                    size: req.body.size,
                    image: req.body.image,
                    type: req.body.type,
                }
            }
            const expiryDate = new Date(Number(new Date()) + 315360000000);
            await res.cookie("cart", cartObj, { httpOnly: true, maxAge: expiryDate, sameSite: 'lax' });
            res.json({ data: cartObj });
        } else if (req.body.type === 'addon') {
            let key = `${req.body.addonSlug}-.-.-addon`;
            if (cartObj[key]) {
                cartObj[key].quantity += 1;
            } else {
                cartObj[key] = {
                    name: req.body.name,
                    addonSlug: req.body.addonSlug,
                    quantity: 1,
                    price: req.body.price,
                    image: req.body.image,
                    type: req.body.type,
                }
            }
            const expiryDate = new Date(Number(new Date()) + 315360000000);
            await res.cookie("cart", cartObj, { httpOnly: true, maxAge: expiryDate, sameSite: 'lax' });
            res.json({ data: cartObj });
        } else if (req.body.type === 'diy') {
            let key = `diy-${Object.keys(cartObj).length + 1}`;
            const size = await Size.findOne({ slug: req.body.size }, { _id: 0 });
            const base = await Base.findOne({ slug: req.body.base }, { _id: 0 });
            const color = await Color.findOne({ slug: req.body.color }, { _id: 0 });
            cartObj[key] = {
                name: 'DIY',
                size: size,
                base: base,
                color: color,
                flowers: req.body.flowers,
                addons: req.body.addons,
                type: req.body.type,
                quantity: 1,
                image: '/products/515.jpg'
            }
            const expiryDate = new Date(Number(new Date()) + 315360000000);
            await res.cookie("cart", cartObj, { httpOnly: true, maxAge: expiryDate, sameSite: 'lax' });
            res.json({ data: cartObj });
        } else {
            res.json({ data: cartObj });
        }
        // if (cartCookie) {
        //     const cartObj = {
        //         data: cartCookie.data,
        //         count: cartCookie.count,
        //         cartTotalPrice: cartCookie.cartTotalPrice
        //     }
        //     if (req.body.productSlug && req.body.productSlug in cartObj.data) {
        //         const itemPrice = cartObj.data[`${req.body.productSlug}`].item.price;
        //         cartObj.data[`${req.body.productSlug}`]['count'] += 1;
        //         cartObj.data[`${req.body.productSlug}`].totalPrice += itemPrice;
        //         cartObj.cartTotalPrice += itemPrice;
        //     } else if (req.body.productSlug) {
        //         const product = await Product.findOne({slug: req.body.productSlug}, {_id: 0, base: 0, slug: 0});
        //         cartObj.data[`${req.body.productSlug}`] = {
        //             item: product,
        //             count: 1,
        //             totalPrice: product.price,
        //             type: 'product'
        //         };
        //         cartObj.cartTotalPrice += product.price;
        //     } else if (req.body.addonSlug && req.body.addonSlug in cartObj.data) {
        //         const itemPrice = cartObj.data[`${req.body.addonSlug}`].item.price;
        //         cartObj.data[`${req.body.addonSlug}`]['count'] += 1;
        //         cartObj.data[`${req.body.addonSlug}`].totalPrice += itemPrice
        //         cartObj.cartTotalPrice += itemPrice;
        //     } else if (req.body.addonSlug) {
        //         const addon = await Addon.findOne({slug: req.body.addonSlug}, {_id: 0, base: 0, slug: 0});
        //         cartObj.data[`${req.body.addonSlug}`] = {
        //             item: addon,
        //             count: 1,
        //             totalPrice: addon.price,
        //             type: 'addon'
        //         };
        //         cartObj.cartTotalPrice += addon.price;
        //     } else if(req.body.diy) {
        //         const diy = req.body.diy;
        //         const size = diy.size;
        //         const base = diy.base;
        //         const color = diy.color;
        //         const flowerCheckbox = diy.flowerCheckbox;
        //         const addonCheckbox = diy.addonCheckbox;
        //         const flowerArray = diy.flowerArray;
        //         const addonArray = diy.addonArray;
        //         const cost = diy.cost;
        //         const finalFlowerArray = [];
        //         for (let index = 0; index < flowerCheckbox.length; index++) {
        //             const bool = flowerCheckbox[index];
        //             const flower = flowerArray[index];
        //             if (bool) finalFlowerArray.push(flower);
        //         }
        //         const finalAddonArray = [];
        //         for (let index = 0; index < addonCheckbox.length; index++) {
        //             const bool = addonCheckbox[index];
        //             const addon = addonArray[index];
        //             if (bool) finalAddonArray.push(addon);
        //         }
        //         cartObj.data[`diy-${Object.keys(cartObj.data).length + 1}`] = {
        //             item: {
        //                 name: 'Do it Yourself',
        //                 imagePath: '/products/515.jpg',
        //                 size: size,
        //                 base: base,
        //                 color: color,
        //                 flowers: finalFlowerArray,
        //                 addons: finalAddonArray,
        //                 price: cost
        //             },
        //             count: 1,
        //             totalPrice: cost,
        //             type: 'diy'
        //         };
        //         cartObj.cartTotalPrice += cost;
        //     }
        //     cartObj.count = Object.keys(cartObj.data).length;
        //     const expiryDate = new Date(Number(new Date()) + 315360000000); 
        //     await res.cookie("cart", cartObj, {httpOnly: true, maxAge: expiryDate, sameSite: 'lax'});
        //     res.json({data: cartObj});
    } else {
        res.json({ data: null });
    }
});

router.get('/removeItem', async (req, res) => {
    const cartCookie = req.cookies['cart'];
    const { key } = req.query;
    if (cartCookie) {
        const cartObj = cartCookie;
        cartObj[key].quantity -= 1;
        if (cartObj[key].quantity === 0) {
            delete cartObj[key];
        }
        const expiryDate = new Date(Number(new Date()) + 315360000000);
        await res.cookie("cart", cartObj, { httpOnly: true, maxAge: expiryDate, sameSite: 'lax' });
        res.json({ data: cartObj });
    } else {
        res.json({ data: null });
    }
    // if (cartCookie) {
    //     const cartObj = {
    //         data: cartCookie.data,
    //         count: cartCookie.count,
    //         cartTotalPrice: cartCookie.cartTotalPrice
    //     }
    //     if (req.query.productSlug && req.query.productSlug in cartObj.data) {
    //         const itemPrice = cartObj.data[`${req.query.productSlug}`].item.price;
    //         cartObj.data[`${req.query.productSlug}`]['count'] -= 1;
    //         cartObj.data[`${req.query.productSlug}`].totalPrice -= itemPrice
    //         cartObj.cartTotalPrice -= itemPrice;
    //         if (cartObj.data[`${req.query.productSlug}`]['count'] === 0) delete cartObj.data[`${req.query.productSlug}`];
    //     } else if (req.query.addonSlug && req.query.addonSlug in cartObj.data) {
    //         const itemPrice = cartObj.data[`${req.query.addonSlug}`].item.price;
    //         cartObj.data[`${req.query.addonSlug}`]['count'] -= 1;
    //         cartObj.data[`${req.query.addonSlug}`].totalPrice -= itemPrice
    //         cartObj.cartTotalPrice -= itemPrice;
    //         if (cartObj.data[`${req.query.addonSlug}`]['count'] === 0) delete cartObj.data[`${req.query.addonSlug}`];
    //     } else if (req.query.diySlug && req.query.diySlug in cartObj.data) {
    //         const itemPrice = cartObj.data[`${req.query.diySlug}`].item.price;
    //         cartObj.data[`${req.query.diySlug}`]['count'] -= 1;
    //         cartObj.data[`${req.query.diySlug}`].totalPrice -= itemPrice
    //         cartObj.cartTotalPrice -= itemPrice;
    //         if (cartObj.data[`${req.query.diySlug}`]['count'] === 0) delete cartObj.data[`${req.query.diySlug}`];
    //     }
    //     cartObj.count = Object.keys(cartObj.data).length;
    //     const expiryDate = new Date(Number(new Date()) + 315360000000);
    //     await res.cookie("cart", cartObj, { httpOnly: true, maxAge: expiryDate, sameSite: 'lax' });
    //     res.json({ data: cartObj });
    // }
});

router.get('/addItem', async (req, res) => {
    const cartCookie = req.cookies['cart'];
    const { key } = req.query;
    if (cartCookie) {
        const cartObj = cartCookie;
        cartObj[key].quantity += 1;
        const expiryDate = new Date(Number(new Date()) + 315360000000);
        await res.cookie("cart", cartObj, { httpOnly: true, maxAge: expiryDate, sameSite: 'lax' });
        res.json({ data: cartObj });
    } else {
        res.json({ data: null });
    }
    // if (cartCookie) {
    //     const cartObj = {
    //         data: cartCookie.data,
    //         count: cartCookie.count,
    //         cartTotalPrice: cartCookie.cartTotalPrice
    //     }
    //     if (req.query.productSlug && req.query.productSlug in cartObj.data) {
    //         const itemPrice = cartObj.data[`${req.query.productSlug}`].item.price;
    //         cartObj.data[`${req.query.productSlug}`]['count'] += 1;
    //         cartObj.data[`${req.query.productSlug}`].totalPrice += itemPrice
    //         cartObj.cartTotalPrice += itemPrice;
    //     } else if (req.query.addonSlug && req.query.addonSlug in cartObj.data) {
    //         const itemPrice = cartObj.data[`${req.query.addonSlug}`].item.price;
    //         cartObj.data[`${req.query.addonSlug}`]['count'] += 1;
    //         cartObj.data[`${req.query.addonSlug}`].totalPrice += itemPrice
    //         cartObj.cartTotalPrice += itemPrice;
    //     } else if (req.query.diySlug && req.query.diySlug in cartObj.data) {
    //         const itemPrice = cartObj.data[`${req.query.diySlug}`].item.price;
    //         cartObj.data[`${req.query.diySlug}`]['count'] += 1;
    //         cartObj.data[`${req.query.diySlug}`].totalPrice += itemPrice
    //         cartObj.cartTotalPrice += itemPrice;
    //     }
    //     cartObj.count = Object.keys(cartObj.data).length;
    //     const expiryDate = new Date(Number(new Date()) + 315360000000);
    //     await res.cookie("cart", cartObj, { httpOnly: true, maxAge: expiryDate, sameSite: 'lax' });
    //     res.json({ data: cartObj });
    // }
});


module.exports = router;