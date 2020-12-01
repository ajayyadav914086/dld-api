import mongoose from 'mongoose';
let DataEntrySchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    enabled: {
        type: Boolean,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    numbering: {
        type: Number,
        required: true
    },
    partyName: {
        type: String,
        required: true
    },
    respondentName: {
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
    resuts: {
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
    fullTextJudgement: {
        type: String,
        required: true
    },
})

var DataEntry = mongoose.model('DataEntry', DataEntrySchema);
module.exports = DataEntry;