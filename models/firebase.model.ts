import mongoose from 'mongoose';

const firebaseSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true,
    },
});

var Firebase = mongoose.model('firebase', firebaseSchema);
module.exports = Firebase;