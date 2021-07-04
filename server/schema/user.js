const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    name:String,
    email:String,
    contactNumber:String,
    salt:String,
    hash:String,
    staff: {
        type: Boolean,
        default: false
    },
    adminApproved: {
        type: Boolean,
        default: false
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    token:String
});

const User = mongoose.model('users', userSchema);

module.exports = User;