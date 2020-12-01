import mongoose from 'mongoose';
import { ObjectID } from 'bson';

let NotificationsSchema = new mongoose.Schema({
    userId: {
        type: ObjectID,
        required: true
    },
    type: {
        type: String,
        required: true,
    },
    timeStamp: {
        type: Date,
        default: Date
    },
    title: {
        type: String,
    },
    message: {
        type: String,
    },
})

// Export the model
var Notifications = mongoose.model('Notifications', NotificationsSchema);
module.exports = Notifications;