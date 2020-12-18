import mongoose from 'mongoose';

let PaymentSchema = new mongoose.Schema({
    txtId: {
        type: String,
    },
    txtAmount: {
        type: Number
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    agentId: {
        type: String
    },
    discountValue: {
        type: Number
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    },
});

var Payment = mongoose.model('Payment', PaymentSchema);
module.exports = Payment;