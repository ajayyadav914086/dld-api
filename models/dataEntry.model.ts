import mongoose from 'mongoose';
var mongoosastic = require('mongoosastic');

let DataEntrySchema = new mongoose.Schema({
    enabled: {
        type: Boolean,
        required: true,
        default: true
    },
    pid: {
        type: String,
        required: true
    },
    respondentName: {
        type: String,
        required: true
    },
    appelentName: {
        type: String,
        required: true
    },
    judges: {
        type: String,
        required: true
    },
    decidedDate: {
        type: String,
        required: true
    },
    importantPoints: {
        type: String,
    },
    importantPointsHindi: {
        type: String
    },
    importantPointsMarathi: {
        type: String,
    },
    importantPointsGujrati: {
        type: String,
    },
    headNote: {
        type: String,
        required: true
    },
    headNoteHindi: {
        type: String,
        required: false
    },
    headNoteGujrati: {
        type: String,
        required: false
    },
    headNoteMarathi: {
        type: String,
        required: false
    },
    result: {
        type: String,
        required: true
    },
    resultHindi: {
        type: String,
    },
    resultMarathi: {
        type: String,
    },
    resultGujrati: {
        type: String,
    },
    links: {
        type: String,
    },
    caseReffered: {
        type: String,
        required: false
    },
    actsReffered: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: true
    },
    fullJudgement: {
        type: String,
        required: true
    },
})

DataEntrySchema.plugin(mongoosastic);
var DataEntry = mongoose.model('DataEntry', DataEntrySchema);
module.exports = DataEntry;