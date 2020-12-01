import mongoose from 'mongoose';

let CountSchema = new mongoose.Schema({
    lastId: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    posts: {
        type: Number,
        required: true
    },
    sync: {
        type: Boolean
    },
    totalLive: {
        type: Number
    },
    faSession: {
        type: String
    }
});

var Count = mongoose.model('Count', CountSchema);
module.exports = Count;