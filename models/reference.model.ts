import mongoose from 'mongoose';

let ReferenceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        unique: true,
        required: true
    },
    referredById: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now(),
        required: true
    }
});

var Reference = mongoose.model('Reference', ReferenceSchema);
module.exports = Reference;