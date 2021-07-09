const router = require('express').Router();
// const database = require( '../db' );
const nodemailer = require('nodemailer');
const User = require('../schema').user;
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const crypto = require("crypto");
dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.com',
    port: 465,
    secure: true,
    auth: {
      user: 'no-reply@flowerworks.pk',
      pass: 'flowerworks'
    }
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        return res.status(404).send({
            loggedIn: false
        })
    } else {
        const salt = user.salt;
        const userHash = user.hash;
        const password = req.body.password;
        const hash = crypto.pbkdf2Sync(password, salt,  parseInt(process.env.ITERATIONS), 64, process.env.HASH_ALGORITHM).toString(`hex`);
        if (userHash !== hash) {
            res.json({
                loggedIn: false
            });
        } else {
            const token = generateAccessToken(user.firstName, user.lastName, user.email, user.staff, user.emailVerified, user.contactNumber);
            res.status(200)
            .cookie('token', token, {httpOnly: true, secure:true, maxAge: 24 * 60 * 60 * 1000, sameSite: 'lax'})
            .json({loggedIn: true});
        }
    }
});

router.get('/loggedIn', async (req, res) => {
    try {
        const cookie = req.cookies['token'];

        const claims = jwt.verify(cookie, process.env.TOKEN_SECRET);
        if (!claims) {
            return res.status(401).send({loggedIn: false});
        }
        res.status(200).send({loggedIn: true, data: claims});
    } catch (e) {
        return res.status(401).send({
            loggedIn: false
        });
    }
});

router.post('/logout', (req, res) => {
    res.cookie('token', '', {maxAge: 0, sameSite: 'lax'});

    res.send({
        message: 'success'
    })
});

router.get('/TableData', async (req, res) => {
    const users = await User.find({}, {projection: {hash: 0, salt: 0}});
    if (!users) res.json({data: []});
    else res.json({data: users});
});

router.post('/add', async (req, res) => {
    const token = crypto.randomBytes(64).toString('hex');
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(req.body.password, salt,  parseInt(process.env.ITERATIONS), 64, process.env.HASH_ALGORITHM).toString(`hex`);
    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        contactNumber: req.body.contactNumber,
        salt: salt,
        hash: hash,
        staff: req.body.staff,
        adminApproved: req.body.adminApproved,
        token:token
    });
    newUser.save();
    const mailOptions = {
        from: 'no-reply@flowerworks.pk',
        to: req.body.email,
        subject: 'Email verification',
        html: `<p>Please click the below link to verify your email:</p><a href="http://localhost:4000/api/users/verify/${token}">Verify</a>`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
    res.json({data: 'success'});
});

router.get('/verify/:token', async (req, res) => {
    const { token } = req.params;
    const user = await User.findOne({token: token});
    if (user) {
        user.emailVerified = true;
        user.save();
        res.json({message:'Email verified!'});
    } else {
        res.json({message: 'Invalid token'});
    }
});

router.get('/getByIds', async (req, res) => {
    let id = '';
    if ('id' in req.query) id = req.query.id;
    const getIds = id.split(',');
    const users = await User.find({_id: getIds}, {projection: {hash: 0, salt: 0}});
    if (!users) res.json({data: []});
    else res.json({data: users});
});

router.post('/delete', async (req, res) => {
    await User.deleteMany({_id: req.body.ids}, {projection: {hash: 0, salt: 0}});
    res.json({data: 'success'});
});

function generateAccessToken(firstName, lastName, email, staff, emailVerified, contactNumber) {
    return jwt.sign({firstName: firstName, lastName: lastName, email: email, staff: staff, emailVerified: emailVerified, contactNumber: contactNumber}, process.env.TOKEN_SECRET, { expiresIn: '24h' });
}

module.exports = router;