import mongoose from 'mongoose';

let PlanSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    months: {
        type: Number
    },
    language: {
        type: Number,
        required: true
    },
    type: {
        type: Number
    },
    discount: {
        type: String,
    },
    total: {
        type: Number,
    },
    cost: {
        type: Number,
    }, 
    order: {
        type: Number,
    },
    planExpiry: {
        type: Date
    },
    enabled: {
        type: Boolean,
        default: true,
    }
});

var Plan = mongoose.model('Plan', PlanSchema);
module.exports = Plan;