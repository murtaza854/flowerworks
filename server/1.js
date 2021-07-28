const crypto = require("crypto");
const prompt = require('prompt-sync')();
const dotenv = require('dotenv');
dotenv.config();
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const userController = require('./controllers').user;
const url = process.env.DATABASE_URL;

MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
    if (err) throw err;
    console.log('database created!')
    const dbo = db.db("flowerworks");
//   dbo.collection("users").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
    let firstName = '';
    while (firstName === '') firstName = prompt('First name: ').trim();
    let lastName = '';
    while (lastName === '') lastName = prompt('Last name: ').trim();
    let email = '';
    while (email === '') email = prompt('Email: ').trim();
    let contactNumber = '';
    while (contactNumber === '') contactNumber = prompt('Contact Number: ').trim();
    const staff = true;
    const emailVerified = true;
    const adminApproved = true;
    let password = '';
    while (password === '') password = prompt.hide('Password: ');
    const confirmPassword = prompt.hide('Confirm Password: ');
    if (password !== confirmPassword) {
        console.log('Passwords do not match... aboting!');
        process.exit(0);
    };
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt,  parseInt(process.env.ITERATIONS), 64, process.env.HASH_ALGORITHM).toString(`hex`);
    const newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        contactNumber: contactNumber,
        staff: staff,
        emailVerified: emailVerified,
        adminApproved: true,
        salt: salt,
        hash: hash
    };
    const user = userController.create(newUser, dbo);
    // user.then(function(data) {
        console.log(`Account created!`);
    //     process.exit(0);
    // });
});

// const user = Promise.resolve(userController.create({name: name, email: email, contactNumber: contactNumber, organization: organization, role: role, emailVerified: emailVerified, adminApproved: adminApproved, newsletter: newsletter, volunteer: volunteer, password: hash, salt: salt, superuser: superuser}));

// user.then(function(data) {
//     console.log(`Superuser, ${name} with the email, ${email} has been created!`);
//     process.exit(0);
// });
