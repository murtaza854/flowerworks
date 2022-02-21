const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

const firebaseFile = require('./firebase');
// const firebase = firebaseFile.firebase;
// const firebaseAdmin = firebaseFile.admin;

const url = process.env.DATABASE_URL;
const port = parseInt(process.env.PORT);

const createServer = async (callback) => {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

    console.log("Database created!");

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use(cookieParser(
        process.env.COOKIE_SECRET
    ));
    app.use(cors({
        credentials: true,
        // origin: [process.env.API_URL1, process.env.API_URL2]
        origin: [process.env.API_URL3]
    }));
    app.use(express.static('./build'));
    // app.use(express.static(path.join(__dirname, '../client/build')));

    const userRoutes = require('./routes/user');
    const cartRoutes = require('./routes/cart');
    const baseRoutes = require('./routes/base');
    const productRoutes = require('./routes/product');
    const addonRoutes = require('./routes/addon');
    const flowerRoutes = require('./routes/flower');
    const sizeRoutes = require('./routes/size');
    const colorRoutes = require('./routes/color');
    const areaRoutes = require('./routes/area');
    const orderRoutes = require('./routes/order');
    const discountRoutes = require('./routes/discount');
    const couponRoutes = require('./routes/coupon');
    const authRoutes = require('./routes/auth');
    const subscribeRoutes = require('./routes/subscribe');
    const subscribedUserRoutes = require('./routes/subscribedUser');

    app.use('/api/user', userRoutes);
    app.use('/api/cart', cartRoutes);
    app.use('/api/base', baseRoutes);
    app.use('/api/product', productRoutes);
    app.use('/api/addon', addonRoutes);
    app.use('/api/flower', flowerRoutes);
    app.use('/api/size', sizeRoutes);
    app.use('/api/color', colorRoutes);
    app.use('/api/areas', areaRoutes);
    app.use('/api/order', orderRoutes);
    app.use('/api/discounts', discountRoutes);
    app.use('/api/coupon', couponRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/subscribe', subscribeRoutes);
    app.use('/api/subscribedUser', subscribedUserRoutes);


    app.get('*', function (req, res) {
        res.sendFile(path.resolve('./build/index.html'));
    });

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
}

createServer();