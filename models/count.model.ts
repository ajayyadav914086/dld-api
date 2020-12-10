import mongoose from 'mongoose';

let CountSchema = new mongoose.Schema({
    totalCivil: {
        type: Number,
        required: true,
        default: 0
    },
    totalCriminal: {
        type: Number,
        required: true,
        default: 0
    },
});

var Count = mongoose.model('Counts', CountSchema);
module.exports = Count;