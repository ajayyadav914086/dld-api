import mongoose from 'mongoose';

let AdminSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    enabled: {
        type: Boolean,
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
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

var Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;