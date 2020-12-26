import mongoose from 'mongoose';
import * as bcrypt from "bcryptjs";

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

AdminSchema.pre("save", function (next: any) {
    var admin: any = this;
    bcrypt.hash(admin.password, 10, function (err: any, hash: any) {
        if (err) {
            return next(err);
        }
        admin.password = hash;
        next();
    });
});

var Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;