const mongoose = require('mongoose'),
  Schema = mongoose.Schema

const subscribedUserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    area: { type: String, required: true },
    landmark: { type: String },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    type: { type: String, required: true },
    active: { type: Boolean, required: true, default: true },
    subscribe: { type: Schema.Types.ObjectId, ref: 'subscribes', default: null },
});

const SubscribedUser = mongoose.model('subscribedUsers', subscribedUserSchema);

module.exports = SubscribedUser;