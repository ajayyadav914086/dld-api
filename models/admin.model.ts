import mongoose from 'mongoose';

let AdminSchema = new mongoose.Schema({
    enabled: {
        type: Boolean,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        unique: true,
        required: true
    },
    gender: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    discountValue: {
        type: Number,
    },
    agentId: {
        type: String,
    }
});

var Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;