import mongoose from "mongoose";
var mongoosastic = require("mongoosastic");
var textSearch = require("mongoose-text-search");

let DataEntrySchema = new mongoose.Schema(
  {
    enabled: {
      type: Boolean,
      required: true,
      default: false,
    },
    pid: {
      type: String,
      required: true,
      text: true,
    },
    caseNumber: {
      type: String,
      required: false,
      text: true,
    },
    respondentName: {
      type: String,
      required: true,
      text: true,
    },
    appelentName: {
      type: String,
      required: true,
      text: true,
    },
    judges: {
      type: String,
      required: true,
      text: true,
    },
    decidedDate: {
      type: String,
      required: true,
      text: true,
    },
    importantPoints: {
      type: String,
      text: true,
    },
    importantPointsHindi: {
      type: String,
      text: true,
    },
    importantPointsMarathi: {
      type: String,
      text: true,
    },
    importantPointsGujrati: {
      type: String,
      text: true,
    },
    headNote: {
      type: String,
      required: true,
      text: true,
    },
    headNoteHindi: {
      type: String,
      required: false,
      text: true,
    },
    headNoteGujrati: {
      type: String,
      required: false,
      text: true,
    },
    headNoteMarathi: {
      type: String,
      required: false,
      text: true,
    },
    result: {
      type: String,
      required: true,
      text: true,
    },
    resultHindi: {
      type: String,
      text: true,
    },
    resultMarathi: {
      type: String,
      text: true,
    },
    resultGujrati: {
      type: String,
      text: true,
    },
    links: {
      type: String,
      text: true,
    },
    caseReffered: {
      type: String,
      required: false,
      text: true,
    },
    actsReffered: {
      type: String,
      required: false,
      text: true,
    },
    type: {
      type: String,
      required: true,
      text: true,
    },
    fullJudgement: {
      type: String,
      required: true,
      text: true,
    },
    postType: {
      type: Number,
      required: true,
      text: true,
    },
    inFavourOf: {
      type: Number,
    },
    dldId: {
      type: String,
      required: true,
      text: true,
    },
    priority: {
      type: Number,
    },
    courtType: {
      type: Number,
    },
    courtSubType: {
      type: Number,
    },
    rn: {
      type: String,
    },
  },
  { strict: false }
);

DataEntrySchema.plugin(mongoosastic);
DataEntrySchema.index({ "$**": "text" });
// DataEntrySchema.plugin(textSearch);
var DataEntry = mongoose.model("DataEntry", DataEntrySchema);
// DataEntry.ensureIndexes({ "$**": "text" });
module.exports = DataEntry;
