const mongoose = require('mongoose'),
  Schema = mongoose.Schema

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  firstName1: { type: String, required: true },
  lastName1: { type: String, required: true },
  phoneNumber1: { type: String, required: true },
  email1: { type: String, required: true },
  area: { type: Schema.Types.ObjectId, ref: 'areas', required: true },
  addressLine1: { type: String, required: true },
  landmark: { type: String },
  addressLine2: { type: String },
  deliveryDate: { type: Date, required: true },
  orderDate: { type: Date, required: true, default: new Date() },
  message: { type: String },
  receiver: { type: Boolean, required: true },
  callMe: { type: Boolean, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, required: true },
  items: { type: Object, required: true },
  totalPrice: { type: Number, required: true },
  numberOfItems: { type: Number, required: true },
  discount: { type: Schema.Types.ObjectId, ref: 'discounts', default: null },
  user: { type: Schema.Types.ObjectId, ref: 'users', default: null }
});

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;