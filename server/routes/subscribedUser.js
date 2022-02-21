const router = require('express').Router();
const SubscribedUser = require('../schema').subscribedUser;
const Subscribe = require('../schema').subscribe;
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config();

router.get('/getAllSubscribedUsers', async (req, res) => {
    const subscribedUsers = await SubscribedUser.find({});
    res.json({ data: subscribedUsers });
});

router.post('/user-subscribe', async (req, res) => {
    const data = req.body;
    try {
        const subscribe = await Subscribe.findById(data.subscribePackage);
        if (subscribe) {
            let string = `${subscribe.packageLength} ${subscribe.packageLengthUnit} - ${subscribe.baseAmount} ${subscribe.base} (PKR.${subscribe.price} per ${subscribe.packageLengthUnit})`;
            const subscribedUser = new SubscribedUser({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                area: data.area,
                landmark: data.landmark,
                addressLine1: data.addressLine1,
                addressLine2: data.addressLine2,
                type: data.subscribeType,
                subscribe: subscribe,
            });
            await subscribedUser.save();
            let transporter = nodemailer.createTransport({
                service: 'Yandex', // no need to set host or port etc.
                auth: {
                    user: process.env.NOREPLY_EMAIL,
                    pass: process.env.NOREPLY_PASSWORD
                }
            });
            let info = await transporter.sendMail({
                from: `"Flowerworks" <${process.env.NOREPLY_EMAIL}>`, // sender address
                to: `${data.email}`, // list of receivers
                subject: "Flowerworks: Subscription", // Subject line
                html: `<!DOCTYPE html>
                <html lang="en">
                
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                
                <body>
                    <h1>Thankyou for Subscribing!</h1>
                    <h2>Package Details:</h2>
                    <ul>
                        <li>
                            <p><strong>Package:</strong> ${string}</p>
                        </li>
                        <li>
                            <p><strong>Type of Flowers:</strong> ${data.subscribeType}</p>
                        </li>
                        <li>
                            <p><strong>Customer Name:</strong> ${data.firstName} ${data.lastName}</p>
                        </li>
                        <li>
                            <p><strong>Phone Number:</strong> ${data.phoneNumber}</p>
                        </li>
                        <li>
                            <p><strong>Email:</strong> ${data.email}</p>
                        </li>
                    </ul>
                    <p><strong>Address:</strong></p>
                    <p>
                        ${data.addressLine1},<br>
                        ${data.addressLine2 === '' ? '' : data.addressLine2 + ',<br>'}
                        ${data.area}
                    </p>
                    <p><strong>Nearest Landmark:</strong> ${data.landmark === '' ? 'Not Provided.' : data.landmark}</p>
                    <p>
                        Please contact us at <a href="mailto:info@flowerworks.pk"> info@flowerworks.pk</a> for any queries.
                    </p>
                    <p>
                        Thank you,<br>
                        FlowerWorks Team
                    </p>
                </body>
                </html>`, // html body
            });
            res.json({ data: true });
        } else {
            res.json({ data: false });
        }
    } catch (error) {
        res.json({ data: false });
    }
});

module.exports = router;