import mongoose from 'mongoose';

let DataSchema = new mongoose.Schema({
    pid: {
        type: String,
    },
    borrowerName: {
        type: String,
    },
    bankName: {
        type: String,
    },
    propertyType: {
        type: String,
    },
    location: {
        type: String,
    },
    city: {
        type: String,
    },
    priceReserve: {
        type: String
    },
    price: {
        type: Number
    },
    emdAmount: {
        type: String
    },
    bidIncrementValue: {
        type: String
    },
    lastDateOfETenderSubmission: {
        type: String
    },
    auctionStartDateTime: {
        type: String
    },
    auctionEndDateTime: {
        type: String
    },
    lastDateOfETenderSubmissionDate: {
        type: Date,
    },
    auctionStartDateTimeDate: {
        type: Date
    },
    auctionEndDateTimeDate: {
        type: Date
    },
    eAuctionWebsite: {
        type: String
    },
    auctionFile: {
        type: Array
    },
    simliarLink: {
        type: String
    },
    enabled: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    timeStamp: {
        type: Date,
        default: Date
    },
});

// Export the model
var Data = mongoose.model('Data', DataSchema);
module.exports = Data;