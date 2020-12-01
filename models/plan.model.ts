import mongoose from 'mongoose';

let PlanSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    months: {
        type: Number
    },
    language: {
        type: String,
        required: true
    },
    type: {
        type: String
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