import UserController from "../controllers/user.controller";

const firebaseData = require('../models/firebase.model');
const User = require('../models/user.model');

var admin = require("firebase-admin");
const mongoose = require('mongoose');
var Notifications = require('../models/notifications.model');
var moment = require('moment');

var serviceAccount = {
    "type": "service_account",
    "project_id": "bauktion-77e27",
    "private_key_id": "379f42d984d1122afce3d5818a9d9f968befc2bd",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC9dDnYszJApW4C\nINgqGm6VqKE3XJm/lTMtEHBf16dz9WBN2SwSgJ5aZMeh19a9+t2oLyEMXZQHgMQx\nmWsYkBtdiPpikRGE9QKj68eQ0Fx0WsoUl25r8YVOakqJdZb5QFM+JD0cog44KW9r\nAeZ4PufX9P71EW/HERzHRu73EzoNV3QGBDBnV7eTWFCBWWtQHHCtQhubFFBsOjrZ\n3GNQ4J2+USjER+hpJWZCQxS7qE8y/jSCfWAADEEbWR9W2mDyT+8/ELWLJy8CmiJc\nYXJXhY4MAQR2XVlOTOuZ5utp698XtlLCYYpfzPgvdTchiKrQNS25SKeefQ1kesFM\n2Lp/PtK3AgMBAAECggEAD/5KTdle0idFAKf+J5vAnyCzr2VBU3OIdPLw0Z52c+sQ\nfLHrLwqtk4rzcV2zsqkFYkfMPet+bh24Mkm1yUaNENnZ7U060eMPHIBwgfCdBXOO\noKth9nnWm5aMgUssehEslc/gWtTxZ1tUHQ/1gUwqLUhw54ZXzdHLgKUj0jbMzUhh\nsRJcnSoBY5qinijvf4TaEClhWoFdNzy1LJZXUxGVhzlz+QpNPAl4JF5Gj1B+hRz1\nW99TXWCa0n2W9RJHyC+Ksf8K0w91/iyMw+RMctadxjKWX4B4JofmJte5KWlwcsPh\n9Rydn+hPteiFuQZoUpo8x7FLV5Q7oFHRecwkF8nXiQKBgQD7OQvdMHe0c2Fwkfhn\nS1unjfM3/SwGeHwkKYzEQXa64W/f5ZCvoJT5NHZvnaxljNV84SAVlIoJrbQu5ulI\ntMHjmfrPhk+0yM8RNOkN+zdufLz1wxPyWP8+7fA7u5kEgN0HIFXMTA7AT0AQVXBy\nN1QYTVUSvU29Tz+sNmiJBrzxeQKBgQDBDn0eABVchHFkj2iHECSXMbQzdunCZL4L\n5MhlOW7PRoUaBRXtjXchSn0tFVQjUnoiXVYD2ID7J5HDCXYcRIbm5zKAv3GPkvUb\nozLgLZ0au5nRwYXNosZjyDft+uBEhQTN0dF/ihYy9ffEARfbot8HrqBEZTIIi0AK\n/rfrgryJrwKBgQD55YIWsUqx1oAbwSfuYDi40Gwayp0Lhrg+JJKg+lmHhg6KEko9\nWag2yGfzmU1O6qvGgA4xSUOSYxaz/QAbUar4o0epPPp2Y7YOcKpPPRCjuDMi6L0j\nukGUsIzibjbFEwZKO3D9Or8Frw+T79ld1Amz7uDsNiBparZ0sN6FR42VSQKBgC6j\nKWaN7psjA6GfY0j9hVlhEH8+QspLO/3zjtWlQjegeZcHk3yHqDfKnuK9PE4sJoUW\ntyjGrKH/tR7Asl+xzkUJpRGlLfHZNo0up6OwYTuMBmS9s20x3WtNevVqnbLvz3FJ\nNqrw2NwGv4wCF5lfhzF75gufxq55tUbyscubEaDRAoGAAbmbobHELcgDLbLq1DZg\nRh5BN3PoE8ljV67bJBqKYQxypxT9gmdkr3+hWKIqRC1tg1IET/VDRXcl/Plcu+Di\nHC0LdVlqVoAmpyrI6Ca+vAc8Zj+mkZuOio6wXoskOBHALrrLgbMLlIDtOfrJNl5g\nANFU4WnIFbgYB1ctOdaxvc0=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-dstmn@bauktion-77e27.iam.gserviceaccount.com",
    "client_id": "111286774141811416594",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-dstmn%40bauktion-77e27.iam.gserviceaccount.com"
};



export default class FirebaseNotification {

    static initFirebaseConfig() {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://bauktion-77e27.firebaseio.com"
        });
    }

    // static sendNotificationTest(){
    //     admin.messaging().sendToDevice('cUfORmEvCpQ:APA91bGbtNzlwcGqxl2AHKct-SO976rOgEguEoKLKA26JMGWz0UfCp_6zOlYURDeZ7w7fnO7b75Op6ihn-0ASnQkyspGJQI5IHyTd8_PZUw3azcegiWTbXIT5f4PpCj3KxyEdPsFXNi3', {
    //         notification: {
    //                         title: 'Ayuskama',
    //                         body: 'hello ayuskama user',
    //                         sound: 'default'
    //                 },
    //     }, {
    //         priority: 'high',
    //     })
    //     .then((response: any) => {
    //         // Response is a message ID string.
    //         console.log('Successfully sent message:', response);
    //     })
    //     .catch((error: any) => {
    //         console.log('Error sending message:', error);
    //     });

    // }

    static sendPushNotificaiton(userId: String, payload: any, options: any, res: any) {
        User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(userId) }, { $inc: { notificationCount: 1 } }, { new: true }, (err: any, user: any) => {
            if (err) {
                console.log(err);
            } else {
                var notificationData = {
                    userId: userId,
                    type: '1',
                    title: payload.data.title,
                    message: payload.data.body,
                }
                Notifications.create(notificationData, function (err: any, appointment: any) {
                });
                firebaseData.find({ userId: userId }, function (error: any, result: any) {
                    if (error) {

                    } else {
                        if (result) {
                            result.forEach((user: any) => {
                                if (user.token) {
                                    admin.messaging().sendToDevice(user.token, payload, options)
                                        .then((response: any) => {
                                            // Response is a message ID string.
                                            console.log('Successfully sent message:', response);
                                        })
                                        .catch((error: any) => {
                                            console.log('Error sending message:', error);
                                        });
                                }
                            });
                            res.status(200).json(
                                {
                                    message: 'Successfully bookmarked',
                                    responseCode: 200
                                }
                            );
                        }
                    }
                });
            }
        });
    }

    static sendPushNotificaitonToAll(payload: any, options: any) {
        var userId = '';
        User.find(function (error: any, result: any) {
            if (error) {

            } else {
                result.forEach((user: any) => {
                    userId = user._id;
                    User.findOneAndUpdate({ _id: userId }
                        , { $inc: { notificationCount: 1 } }, { new: true }, (err: any, user: any) => {
                            if (err) {
                                console.log(err);
                            } else {
                                var notificationData = {
                                    userId: user._id.toString(),
                                    type: '1',
                                    title: payload.data.title,
                                    message: payload.data.body,
                                }
                                Notifications.create(notificationData, function (err: any, appointment: any) {
                                });
                                firebaseData.find({ userId: user._id.toString() }, function (error: any, result: any) {
                                    if (error) {

                                    } else {
                                        if (result) {
                                            result.forEach((user: any) => {
                                                if (user && user.token) {
                                                    admin.messaging().sendToDevice(user.token, payload, options)
                                                        .then((response: any) => {
                                                            // Response is a message ID string.
                                                            console.log('Successfully sent message:', response);
                                                        })
                                                        .catch((error: any) => {
                                                            console.log('Error sending message:', error);
                                                        });
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        })
                });
                // res.status(200).json(
                //     {
                //         message: 'Successfully bookmarked',
                //         responseCode: 200
                //     }
                // );
            }

        });
    }


    static sendPushNotificaitonToAllExpiredWithRes(payload: any, options: any, res: any) {
        var userId = '';
        User.find(function (error: any, result: any) {
            if (error) {

            } else {
                result.forEach((user: any) => {
                    userId = user._id;
                    if (moment(Date.now()).diff(user.planExpiryDate, 'days') >= 0) {
                        User.findOneAndUpdate({ _id: userId }
                            , { $inc: { notificationCount: 1 } }, { new: true }, (err: any, user: any) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    var notificationData = {
                                        userId: user._id.toString(),
                                        type: '1',
                                        title: payload.data.title,
                                        message: payload.data.body,
                                    }
                                    Notifications.create(notificationData, function (err: any, appointment: any) {
                                    });
                                    firebaseData.find({ userId: user._id.toString() }, function (error: any, result: any) {
                                        if (error) {

                                        } else {
                                            if (result) {
                                                result.forEach((user: any) => {
                                                    if (user && user.token) {
                                                        admin.messaging().sendToDevice(user.token, payload, options)
                                                            .then((response: any) => {
                                                                // Response is a message ID string.
                                                                console.log('Successfully sent message:', response);
                                                            })
                                                            .catch((error: any) => {
                                                                console.log('Error sending message:', error);
                                                            });
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            })
                    }
                });
                res.status(200).json(
                    {
                        message: 'Successfully bookmarked',
                        responseCode: 200
                    }
                );
            }

        });
    }

    static sendPushNotificaitonToAllWithRes(payload: any, options: any, res: any) {
        var userId = '';
        User.find(function (error: any, result: any) {
            if (error) {

            } else {
                result.forEach((user: any) => {
                    userId = user._id;
                    User.findOneAndUpdate({ _id: userId }
                        , { $inc: { notificationCount: 1 } }, { new: true }, (err: any, user: any) => {
                            if (err) {
                                console.log(err);
                            } else {
                                var notificationData = {
                                    userId: user._id.toString(),
                                    type: '1',
                                    title: payload.data.title,
                                    message: payload.data.body,
                                }
                                Notifications.create(notificationData, function (err: any, appointment: any) {
                                });
                                firebaseData.find({ userId: user._id.toString() }, function (error: any, result: any) {
                                    if (error) {

                                    } else {
                                        if (result) {
                                            result.forEach((user: any) => {
                                                if (user && user.token) {
                                                    admin.messaging().sendToDevice(user.token, payload, options)
                                                        .then((response: any) => {
                                                            // Response is a message ID string.
                                                            console.log('Successfully sent message:', response);
                                                        })
                                                        .catch((error: any) => {
                                                            console.log('Error sending message:', error);
                                                        });
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        })
                });
                res.status(200).json(
                    {
                        message: 'Successfully bookmarked',
                        responseCode: 200
                    }
                );
            }

        });
    }

    // static sendPushNotificationToEventOwner(userId: any, userName: any, postId: any, user: any) {
    //     var message = " has left!";

    //     FirebaseNotification.sendPushNotificaiton(userId, {
    //         data: {
    //             type: "4",
    //             postId: postId,
    //             user: JSON.stringify(user),
    //             title: 'Amigos',
    //             body: userName + message,
    //         },
    //         notification: {
    //             title: 'Amigos',
    //             body: userName + message,
    //             sound: 'default'
    //         },

    //     }, {
    //         priority: 'high',
    //     });
    // }

    static addTokenToFirebaseData(token: String, userId: String) {
        firebaseData.updateOne({ token: token, userId: userId }, { $set: { token: token } }, { upsert: true }, (error: any, result: any) => {
            if (error) {
                console.log('Error while adding token:', error);
            } else {
                console.log('Successfully added token:', result);
            }
        });
    }

    static deleteTokenToFirebaseData(token: String, userId: String) {
        firebaseData.delete({ token: token, userId: userId }, (error: any, result: any) => {
            if (error) {
                console.log('Error while adding token:', error);
            } else {
                console.log('Successfully added token:', result);
            }
        });
    }
}


