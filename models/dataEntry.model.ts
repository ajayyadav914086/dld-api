import mongoose from 'mongoose';
let DataEntrySchema = new mongoose.Schema({
    pid: {
        type: Number,
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
    importantPoint: {
        type: String,
        required: false
    },
    importantPointHindi: {
        type: String,
        required: false
    },
    importantPointMarathi: {
        type: String,
        required: false
    },
    importantPointGujrati: {
        type: String,
        required: false
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
    links: {
        type: String,
        required: true
    },
    caseReferred: {
        type: String,
        required: false
    },
    actsRefered: {
        type: String,
        required: false
    },
    fullJudgement: {
        type: String,
        required: true
    },
})

var DataEntry = mongoose.model('DataEntry', DataEntrySchema);
module.exports = DataEntry;