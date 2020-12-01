import mongoose from 'mongoose';

let BookmarkSchema = new mongoose.Schema({
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    pid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
});

var Bookmark = mongoose.model('Bookmark', BookmarkSchema);
module.exports = Bookmark;