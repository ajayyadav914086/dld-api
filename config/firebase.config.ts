import UserController from "../controllers/user.controller";

const firebaseData = require('../models/firebase.model');
const User = require('../models/user.model');

var admin = require("firebase-admin");
const mongoose = require('mongoose');
var Notifications = require('../models/notifications.model');
var moment = require('moment');

var serviceAccount = {
    "type": "service_account",
    "project_id": "dlda-90214",
    "private_key_id": "7045532e911d039837643ec0be56749b8629e39a",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDmhDZNk4WwRFO7\nkc7nvZTjvaPeSP6j5vgefiXTRELIbqMchx0exdGNjo8+W9LQj/iwliKMSRKN8sir\n1W2auWe6JsH0hHuCoUnfQGS/HxBDCWBdX7cI6T4IEqPq7swrx4mDKUqeFu+hs1pX\n1Ir+HzdBky1xujlaNaL95i6aBf8LfJ2ZVvwyUGSgErzNW4N0Apho3ITQwe6ZM49d\njllGMxg07qfSWIcnWpsrdac8ED8N49Znk8t8PcunVwCmpLvPWli7GYAxlPl4nUFb\n2QGNRxG4S5baxa5KAxWZlS/bSRvhhnq2x63sbM6CAKgLQ/6Bem45n420vXBpB0H3\nf81O9OBfAgMBAAECggEAFtR2oa2VSqUkZdSbA/iStmYhxJzAxhrUmAXbroDO3Gru\nB0qaZ7clJI/p6pMi3eUPDEN88x00PpASWnJY2JS5i9uAJLy6PsXFOzHKyI2bCV30\nXUsNevnJWvioTgGN1wgmu7FrN8etvqYKBzOAUIq8Pj0FUy4jtVDP7mAjCBNv9Fht\numgmxF+IaQ8j2x8MwCnuH+pd/pDkUTyp3K/o73Yc3/+p7efHtk/ygDUFvo8DC/X/\n3ZO9D6VkNDm1IXXdP1sTJ8MEvyG9lVSuN1sgGSFD/O96DYe+3QLpSRzYvj0e66lj\nqAxNJvFakbBh7gtzWYqRzzIwN4AXQFIxptiC+HmHgQKBgQDzFhipS4WyNnHxD52q\nEmaU5ZSOffj/x+AgReDlkWTHCN98k0Rggyk7pE7AvXUYTZMx4PzAXkFciBP9TuMz\nivC2TXSXwrcYWPFWdSeVbBoeAT7+OlHu1JZE1RAjme0qHMYwT8fDDFUN6cT4GAS5\nOcY1sSJWRsT0MzFElE1ukeRmNQKBgQDywytYgf6SGZs87WCP/73yt4jVXcRm2HBy\nFt8VfibPWnk3VRkwLrlVop8ytil/TEOOFlRcz6NNgcockL+wqNf4j7AxwvZo8YPP\ngE2hmhMxNYuVlupRrU8eH8gTz79X3T69aK8lpXaP4g5RkEYoQ8oSEvRMtr2isE9J\nLclv8teuwwKBgQDf3ZKanq2iwRdP/KSjksycBY45Z/QfgzB6KECEytB3qElBTdKj\n20bm4VuRjyk+V3rebaf3dRZWpA9csgD1X9hs24orlSvPpWGk0MHCj0rCJT2hHY6F\nF4zIGTwCvWg350XyChcbHslZxdca7+uxtW4/1kCcGhKaHmcaFEX3NS6VnQKBgQCY\nGhzAecJs+8o+JGTKFGyI9OGw/e0emyHo+deQedgLNx6XwqPjgoLw2tFwTp41ei0h\ni3AULqyc1WMy/qZ8I24d+LlmlEcbfacejb8WL5kyzd/FPCdYQYQ+1Z7getviS2cR\n+dMzfTaJ9BMQm5q5g6/KH0IeBqlOk7U5noyFrdvhTQKBgQDR5KK6ZntJKdFfy0zM\nmAmaEr515iDRa2aWhDJWZfAANk4xw1fI0tcTt0mUD35XH4DeXyj5zpxtX/877W/o\nUjQuXIs2LUfIfoNYkc0l6FvT8TQ5UbRvq3NCW1BCu1CDqzc4gvti6AJy/S7nQxQb\n6dfggIaEhqaJYbAwB0S+j5746A==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-49lej@dlda-90214.iam.gserviceaccount.com",
    "client_id": "106785225102337246432",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-49lej%40dlda-90214.iam.gserviceaccount.com"
};



export default class FirebaseNotification {

    static initFirebaseConfig() {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://dlda-90214.firebaseio.com"
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

    static sendPushNotificaitonToAllWithTopic(payload: any, options: any) {
        User.updateMany({}
            , { $inc: { notificationCount: 1 } }, { new: true }, (err: any, user: any) => {
                if (err) {
                    console.log(err);
                } else {
        admin.messaging().sendToTopic('all',payload)
            .then((response: any) => {
                // Response is a message ID string.
                console.log('Successfully sent message:', response);
            })
            .catch((error: any) => {
                console.log('Error sending message:', error);
            });
            }});
            
    }

    static sendPushNotificaitonToAllUsingTopic(payload: any, options: any) {
        var userId = '';
        User.find(function (error: any, result: any) {
            if (error) {

            } else {
                result.forEach((user: any) =>  {
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


