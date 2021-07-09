const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

const url = process.env.DATABASE_URL;
const port = 4000;
// database.connectToServer( function( err, client ) {
//     if (err) console.log(err);
//     // start the rest of your app here
// });
const createServer = async ( callback ) => {
    await mongoose.connect( url,  { useNewUrlParser: true, useUnifiedTopology: true });
    
    console.log("Database created!");
    
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    
    app.use(cookieParser(
        process.env.COOKIE_SECRET
    ));
    app.use(cors({
        credentials: true,
        origin: [process.env.API_URL1, process.env.API_URL2]
    }));
    app.use(express.static('../client/public'));
    
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
    
    app.use('/api/users', userRoutes);
    app.use('/api/cart', cartRoutes);
    app.use('/api/bases', baseRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/addons', addonRoutes);
    app.use('/api/flowers', flowerRoutes);
    app.use('/api/sizes', sizeRoutes);
    app.use('/api/colors', colorRoutes);
    app.use('/api/areas', areaRoutes);
    app.use('/api/orders', orderRoutes);
    
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
}

createServer();