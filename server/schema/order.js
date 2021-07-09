var mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    firstName:{ type: String, required: true },
    lastName:{ type: String, required: true },
    phoneNumber:{ type: String, required: true },
    email:{ type: String, required: true },
    firstName1:{ type: String, required: true },
    lastName1:{ type: String, required: true },
    phoneNumber1:{ type: String, required: true },
    email1:{ type: String, required: true },
    area:{ type: String, required: true },
    addressLine1:{ type: String, required: true },
    landmark:{ type: String, required: true },
    addressLine2:{ type: String, required: true },
    date:{ type: Date, required: true },
    message:{ type: String, required: true },
    receiver:{ type: Boolean, required: true },
    callMe:{ type: Boolean, required: true },
    paymentMethod:{ type: String, required: true },
    status:{ type: String, required: true },
    orderItems: [{ type: Schema.Types.ObjectId, ref: 'orderItems' }],
});

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;