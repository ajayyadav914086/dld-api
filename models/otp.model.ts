import mongoose from 'mongoose';

let OtpSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    otp: {
        type: Number
    },
    emailOtp: {
        type: Number
    },
    timestamp: {
        type: Date
    }
});

var Otp = mongoose.model('Otp', OtpSchema);
module.exports = Otp;