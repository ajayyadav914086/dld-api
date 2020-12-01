import mongoose from 'mongoose';

let PlanSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    enabled: {
        type: Boolean,
        required: false
    },
    language: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
});

var Plan = mongoose.model('Plan', PlanSchema);
module.exports = Plan;