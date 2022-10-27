import mongoose from 'mongoose';

let ShortcutsSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true
    },
    shortcut: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now(),
        required: true
    }
});

var Shortcuts = mongoose.model('Shortcuts', ShortcutsSchema);
module.exports = Shortcuts;