import mongoose from 'mongoose';

let SuggestionSchema = new mongoose.Schema({
    suggestion: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now(),
        required: true
    }
});

var Suggestion = mongoose.model('Reference', SuggestionSchema);
module.exports = Suggestion;