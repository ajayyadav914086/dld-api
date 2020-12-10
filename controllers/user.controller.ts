import * as bcrypt from 'bcryptjs';
import { isNullOrUndefined } from 'util';
import FirebaseNotification from '../config/firebase.config';
import Mail from '../config/mail.config';
import upload from '../config/multer.config';
import { otpController } from './otp.controller';
const User = require('../models/user.model');
const Reference = require('../models/reference.model');
const Payment = require('../models/payment.model');
const Bookmark = require('../models/bookmark.model');
const Mails = require('../models/mail.model');
const Otp = require('../models/otp.model');
const Count = require('../models/counts.model');
const jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var moment = require('moment');
var Notifications = require('../models/notifications.model');
var Plans = require('../models/plan.model');
import request = require('request');

export default class UserController {
    addUser = function (req: any, res: any, next: any) {
        var isDoctor = false;
        if (req.body.firebasetoken) {
            var firebasetoken = req.body.firebasetoken;
            if (
                req.body.fullName &&
                req.body.state &&
                req.body.password &&
                req.body.phoneNumber &&
                req.body.city

            ) {
                var userData = {
                    state: req.body.state,
                    password: req.body.password,
                    phoneNumber: req.body.phoneNumber,
                    fullName: req.body.fullName,
                    city: req.body.city,
                }

                User.aggregate([{
                    $match: {
                        phoneNumber: req.body.phoneNumber
                    }
                }]).exec(function (error: any, user: any) {
                    if (user.length == 0) {
                        User.create(userData, function (error: any, user: any) {
                            if (error) {
                                return res.send({
                                    message: 'Unauthorized DB Error',
                                    responseCode: 700,
                                    status: 200,
                                    error: error
                                });
                            } else {
                                var tempUser = user;
                                const token = jwt.sign(tempUser.toJSON(), 'your_jwt_secret');
                                FirebaseNotification.addTokenToFirebaseData(firebasetoken, user._id);
                                otpController.generateOtp(token, res);
                            }
                        });
                    }
                    else {
                        return res.send({
                            message: 'PhoneNumber Already Exists',
                            responseCode: 700,
                            status: 200,
                            error: error
                        })
                    }
                });



            } else {
                return res.send({
                    message: 'All fields required',
                    responseCode: 600,
                    status: 200
                });
            }
        } else {
            res.send({
                message: "firebase token is required",
                status: "200",
                responseCode: 900
            })
        }
    }


    deleteUser = function (req: any, res: any, next: any) {
        var user = req.body.data;
        var value = req.body.value;
        User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(user) }, { 'isDeleted': value }, { new: true }, (err: any, user: any) => {
            if (err) {
                return res.send({
                    message: 'Unauthorized DB Error',
                    responseCode: 700,
                    status: 200,
                    error: err
                });
            } else {
                return res.send({
                    message: 'User Updated Successfully',
                    responseCode: 200,
                    status: 200,
                    user: user
                });
            }
        });
    }

    putUser = function (req: any, res: any, next: any) {
        var user = req.body.data.user;
        var planExpiryDate = req.body.data.planExpiryDate;
        User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(user.id) }, { 'planExpiryDate': planExpiryDate }, { new: true }, (err: any, user: any) => {
            if (err) {
                return res.send({
                    message: 'Unauthorized DB Error',
                    responseCode: 700,
                    status: 200,
                    error: err
                });
            } else {
                return res.send({
                    message: 'User Updated Successfully',
                    responseCode: 200,
                    status: 200,
                    result: user,
                });
            }
        });
    }

    editAccount = function (req: any, res: any) {
        var token = req.headers.token;
        if (token) {
            jwt.verify(token, 'your_jwt_secret', (err: any, user: any) => {
                if (err) {
                    return res.send({
                        message: 'unauthorized access',
                        responseCode: 700,
                        status: 200,
                        error: err
                    });
                } else {
                    User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(user._id) }, { $set: { fullName: req.body.fullName } }, { new: true, returnOriginal: false }, (error: any, result: any) => {
                        if (error) {
                            return res.send({
                                message: 'Unauthorized DB Error',
                                responseCode: 700,
                                status: 200,
                                error: error
                            });
                        } else {
                            return res.send({
                                message: 'User Updated',
                                responseCode: 2000,
                                status: 200,
                                result: result
                            });
                        }
                    })
                }
            })
        }
    }

    getTokenUser = function (req: any, res: any) {
        var token = req.headers.token;
        if (token) {
            jwt.verify(token, 'your_jwt_secret', (err: any, user: any) => {
                if (err) {
                    return res.send({
                        message: 'unauthorized access',
                        responseCode: 700,
                        status: 200,
                        error: err
                    });
                } else {
                    User.findOne({ _id: mongoose.Types.ObjectId(user._id) }, (error: any, result: any) => {
                        if (error) {
                            return res.send({
                                message: 'Unauthorized DB Error',
                                responseCode: 700,
                                status: 200,
                                error: error
                            });
                        } else {
                            return res.send({
                                message: 'User Updated',
                                responseCode: 2000,
                                status: 200,
                                result: result
                            });
                        }
                    })
                }
            })
        }
    }

    token = function (req: any, res: any, next: any) {
        if (req.body.firebasetoken) {
            var firebasetoken = req.body.firebasetoken;
            if (req.body.phoneNumber &&
                req.body.password) {
                User.aggregate([{
                    $match: {
                        phoneNumber: parseInt(req.body.phoneNumber)
                    }
                },]).exec(function (error: any, user: any) {
                    if (error) {
                        return res.send({
                            message: 'Unauthorized DB Error',
                            responseCode: 700,
                            status: 200,
                            error: error
                        });
                    }
                    else if (user.length == 0) {
                        return res.send({
                            message: 'Incorrect Phone Number or password',
                            responseCode: 4000,
                            status: 200,
                        });
                    }
                    else {
                        bcrypt.compare(req.body.password, user[0].password, (error: any, result: any) => {
                            if (result === true) {
                                const token = jwt.sign(JSON.stringify(user[0]), 'your_jwt_secret');
                                FirebaseNotification.addTokenToFirebaseData(firebasetoken, user[0]._id);
                                res.send({
                                    token: token,
                                    user: user[0],
                                    responseCode: 2000
                                });
                            } else {
                                res.send({
                                    error: 'Incorrect Phone Number or password.',
                                    responseCode: "4000",
                                    status: "200"
                                });
                            }

                        });
                    }

                });

            } else {
                return res.send({
                    message: 'All fields required',
                    responseCode: 600,
                    status: 200
                });
            }
        }
        else {
            res.send({
                error: 'Firebase token is required',
                responseCode: "800",
                status: "200"
            });
        }
    }

    getUser = function (req: any, res: any, next: any) {
        var token = req.headers.token;
        var firebasetoken = req.query.firebasetoken;
        if (token) {
            jwt.verify(token, 'your_jwt_secret', (err: any, user: any) => {
                if (err) {
                    return res.send({
                        message: 'unauthorized access',
                        responseCode: 700,
                        status: 200,
                        error: err
                    });
                } else {
                    User.findOne({ _id: mongoose.Types.ObjectId(user._id) }, (err: any, user: any) => {
                        if (err) {
                            return res.send({
                                message: 'unauthorized access',
                                responseCode: 700,
                                status: 200,
                                error: err
                            });
                        } else {
                            FirebaseNotification.addTokenToFirebaseData(firebasetoken, user._id.toString());
                            if (moment(Date.now()).diff(user.planExpiryDate, 'days') >= 0) {
                                User.findByIdAndUpdate({
                                    _id: mongoose.Types.ObjectId(user._id)
                                },
                                    {
                                        isPlanActivied: false,
                                    }, function (error: any, updatedUser: any) {
                                        if (error) {
                                            return res.send({
                                                message: 'unauthorized db error',
                                                responseCode: 800,
                                                status: 200,
                                                error: err
                                            });
                                        } else {
                                            User.aggregate([
                                                {
                                                    $match: {
                                                        _id: mongoose.Types.ObjectId(updatedUser._id)
                                                    }
                                                },
                                                {
                                                    $lookup: {
                                                        from: 'plans',
                                                        as: 'plan',
                                                        localField: "planId",
                                                        foreignField: "_id",
                                                    }
                                                }
                                            ]).exec(function (err: any, user: any) {
                                                if (err) {
                                                    return res.send({
                                                        message: 'unauthorized db error',
                                                        responseCode: 800,
                                                        status: 200,
                                                        error: err
                                                    });
                                                } else {
                                                    if (user.length == 0) {
                                                        return res.send({
                                                            message: 'no user found',
                                                            responseCode: 900,
                                                            status: 200,
                                                            error: err
                                                        });
                                                    } else {
                                                        return res.send({
                                                            message: 'user data',
                                                            responseCode: 300,
                                                            status: 200,
                                                            result: user[0]
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    })
                            } else {
                                User.findByIdAndUpdate({
                                    _id: mongoose.Types.ObjectId(user._id)
                                },
                                    {
                                        isPlanActivied: true,
                                    }, function (error: any, updatedUser: any) {
                                        if (error) {
                                            return res.send({
                                                message: 'unauthorized db error',
                                                responseCode: 800,
                                                status: 200,
                                                error: err
                                            });
                                        } else {
                                            User.aggregate([{
                                                $match: {
                                                    _id: mongoose.Types.ObjectId(updatedUser._id)
                                                }
                                            }]).exec(function (err: any, user: any) {
                                                if (err) {
                                                    return res.send({
                                                        message: 'unauthorized db error',
                                                        responseCode: 800,
                                                        status: 200,
                                                        error: err
                                                    });
                                                } else {
                                                    if (user.length == 0) {
                                                        return res.send({
                                                            message: 'no user found',
                                                            responseCode: 900,
                                                            status: 200,
                                                            error: err
                                                        });
                                                    } else {
                                                        return res.send({
                                                            message: 'user data',
                                                            responseCode: 300,
                                                            status: 200,
                                                            result: user[0]
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    })
                            }
                        }
                    });
                }
            });
        }
        else {
            return res.send({
                message: 'Token is Required',
                responseCode: 800,
                status: 200,
            });
        }

    }

    sendNotificationToAll = function (req: any, res: any, next: any) {
        var title = req.body.data.title;
        var message = req.body.data.message;
        var option = req.body.data.type;
        if (option === 'all') {
            FirebaseNotification.sendPushNotificaitonToAllWithRes({
                data: {
                    type: "1",
                    title: title,
                    body: message,
                },
                notification: {
                    title: title,
                    body: message,
                    sound: 'default'
                },

            }, {
                priority: 'high',
            }, res);
        }
        else {
            FirebaseNotification.sendPushNotificaitonToAllExpiredWithRes({
                data: {
                    type: "1",
                    title: title,
                    body: message,
                },
                notification: {
                    title: title,
                    body: message,
                    sound: 'default'
                },

            }, {
                priority: 'high',
            }, res);
        }
    }

    sendNotificationToAllExpired = function (req: any, res: any, next: any) {
        var title = req.body.data.title;
        var message = req.body.data.message;
        FirebaseNotification.sendPushNotificaitonToAllExpiredWithRes({
            data: {
                type: "1",
                title: title,
                body: message,
            },
            notification: {
                title: title,
                body: message,
                sound: 'default'
            },

        }, {
            priority: 'high',
        }, res);
    }



    getNotifications = function (req: any, res: any, next: any) {
        const pageSize = parseInt(req.query.pageSize);
        const pageIndex = parseInt(req.query.pageIndex);
        var token = req.headers.token;
        if (token) {
            jwt.verify(token, 'your_jwt_secret', (err: any, user: any) => {
                if (err) {
                    return res.send({
                        message: 'unauthorized access',
                        responseCode: 700,
                        status: 200,
                        error: err
                    });
                } else {
                    User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(user._id) }, { $set: { notificationCount: 0 } }, { new: true }, (err: any, user: any) => {
                        if (err) {
                            return res.send({
                                message: 'unauthorized access',
                                responseCode: 700,
                                status: 200,
                                error: err
                            });
                        } else {
                            Notifications.aggregate([
                                {
                                    $match: {
                                        userId: mongoose.Types.ObjectId(user._id)
                                    }
                                },
                                { $sort: { _id: -1 } },
                                { $skip: pageSize * (pageIndex - 1) },
                                { $limit: pageSize }
                            ]).exec(function (err: any, notifications: any) {
                                if (err) {
                                    return res.send({
                                        message: 'unauthorized db error',
                                        responseCode: 800,
                                        status: 200,
                                        error: err
                                    });
                                } else {
                                    return res.send({
                                        message: 'user notifications',
                                        responseCode: 300,
                                        status: 200,
                                        result: notifications
                                    });
                                }
                            })

                        }
                    })

                }
            })
        }
        else {
            return res.send({
                message: 'Token is Required',
                responseCode: 800,
                status: 200,
            });
        }
    }

    adminLogin = function (req: any, res: any, next: any) {
        if (!(req.body.username == 'bauktion' && req.body.password == "bauktion@2019")) {
            return res.send({
                message: 'unauthorized access',
                responseCode: 700,
                status: 200,
            });
        } else {
            return res.send({
                message: 'unauthorized access',
                responseCode: 200,
                status: 200,
            });

        }
    }

    lastIdUpdate(req: any, res: any) {
        if ((req.body.username == 'bauktion' && req.body.password == "bauktion@2019")) {
            Count.findOneAndUpdate({ _id: mongoose.Types.ObjectId('5e8f760e1c9d44000094bb09') }, { lastId: req.body.lastId }, { returnOriginal: false, new: true }, (error: any, result: any) => {
                if (error) {
                    return res.send({
                        message: 'unauthorized db error',
                        responseCode: 800,
                        status: 200,
                        error: error
                    });
                } else {
                    return res.send({
                        message: 'LastId Updated',
                        responseCode: 2000,
                        status: 200,
                        result: result
                    })
                }
            });
        } else {
            return res.send({
                message: 'unauthorized access',
                responseCode: 200,
                status: 200,
            });
        }
    }

    viewAllMails = function (req: any, res: any, next: any) {
        // const pageSize = parseInt(req.query.pageSize);
        // const pageIndex = parseInt(req.query.pageIndex);
        if (!(req.body.username == 'bauktion' && req.body.password == "bauktion@2019")) {
            return res.send({
                message: 'unauthorized access',
                responseCode: 700,
                status: 200,
            });
        } else {
            Mails.find().exec(function (err: any, mails: any) {
                if (err) {
                    return res.send({
                        message: 'unauthorized db error',
                        responseCode: 800,
                        status: 200,
                        error: err
                    });
                } else {
                    return res.send({
                        message: 'mails',
                        responseCode: 300,
                        status: 200,
                        result: mails
                    });
                }
            })

        }
    }
    viewAllBookmark = function (req: any, res: any, next: any) {
        const pageSize = parseInt(req.query.pageSize);
        const pageIndex = parseInt(req.query.pageIndex);
        var token = req.headers.token;
        if (token) {
            jwt.verify(token, 'your_jwt_secret', (err: any, user: any) => {
                if (err) {
                    return res.send({
                        message: 'unauthorized access',
                        responseCode: 700,
                        status: 200,
                        error: err
                    });
                } else {
                    if (pageIndex > 0) {
                        Bookmark.aggregate([
                            {
                                $lookup: {
                                    from: 'dataentries',
                                    as: 'post',
                                    localField: "pid",
                                    foreignField: "_id",
                                },
                            },
                            {
                                $lookup: {
                                    from: 'users',
                                    as: 'user',
                                    localField: "uid",
                                    foreignField: "_id",
                                },
                            },
                            { $unwind: "$post" },
                            { $unwind: "$user" },
                            { $skip: pageSize * (pageIndex - 1) },
                            { $limit: pageSize }
                        ]).exec(function (err: any, bookmarks: any) {
                            if (err) {
                                return res.send({
                                    message: 'unauthorized db error',
                                    responseCode: 800,
                                    status: 200,
                                    error: err
                                });
                            } else {
                                return res.send({
                                    message: 'user bookmarks',
                                    responseCode: 300,
                                    status: 200,
                                    result: bookmarks
                                });
                            }
                        })
                    } else {
                        return res.send({
                            message: "Page Index should pe greater the 0",
                            status: 200,
                            responseCode: 600
                        })
                    }
                }
            })
        }
    }

    viewBookmark = function (req: any, res: any, next: any) {
        const pageSize = parseInt(req.query.pageSize);
        const pageIndex = parseInt(req.query.pageIndex);
        var token = req.headers.token;
        if (token) {
            jwt.verify(token, 'your_jwt_secret', (err: any, user: any) => {
                if (err) {
                    return res.send({
                        message: 'unauthorized access',
                        responseCode: 700,
                        status: 200,
                        error: err
                    });
                } else {
                    Bookmark.aggregate([
                        {
                            $match: {
                                uid: mongoose.Types.ObjectId(user._id)
                            }
                        },
                        {
                            $lookup: {
                                from: 'dataentries',
                                as: 'post',
                                localField: "pid",
                                foreignField: "_id",
                            },
                        },
                        { $unwind: "$post" },
                        { $skip: pageSize * (pageIndex - 1) },
                        { $limit: pageSize }
                    ]).exec(function (err: any, bookmarks: any) {
                        if (err) {
                            return res.send({
                                message: 'unauthorized db error',
                                responseCode: 800,
                                status: 200,
                                error: err
                            });
                        } else {
                            return res.send({
                                message: 'user bookmarks',
                                responseCode: 300,
                                status: 200,
                                result: bookmarks
                            });
                        }
                    })

                }
            })
        }
        else {
            return res.send({
                message: 'Token is Required',
                responseCode: 800,
                status: 200,
            });
        }
    }

    removeBookmark = function (req: any, res: any, next: any) {
        var token = req.headers.token;
        var pid = req.body.pid;
        if (token) {
            jwt.verify(token, 'your_jwt_secret', (err: any, user: any) => {
                if (err) {
                    return res.send({
                        message: 'unauthorized access',
                        responseCode: 700,
                        status: 200,
                        error: err
                    });
                } else {
                    Bookmark.remove({
                        uid: mongoose.Types.ObjectId(user._id),
                        pid: pid,
                    }, (function (error: any, bookmarked: any) {
                        if (error) {
                            return res.send({
                                message: 'Unauthorized DB Error',
                                responseCode: 700,
                                status: 200,
                                error: error
                            });
                        } else {
                            res.status(200).json(
                                {
                                    message: 'removed from bookmarked',
                                    responseCode: 2000
                                }
                            );
                        }
                    })
                    )
                }
            })
        }
    }

    activatePlan = function (req: any, res: any, next: any) {
        var token = req.headers.token;
        var months = req.body.months;
        var isFreePlan = req.body.isFreePlan;
        var txt = req.body.txt;
        var amount = req.body.amount;
        var planId = req.body.planId;

        if (token) {
            jwt.verify(token, 'your_jwt_secret', (err: any, user: any) => {
                if (err) {
                    return res.send({
                        message: 'unauthorized access',
                        responseCode: 700,
                        status: 200,
                        error: err
                    });
                } else {
                    if (isFreePlan) {
                        if (user.isFreePlanUsed) {
                            return res.send({
                                message: 'Free Plan Already Used',
                                responseCode: 701,
                                status: 200,
                            });
                        } else {
                            User.updateOne({
                                _id: mongoose.Types.ObjectId(user._id)
                            },
                                { isFreePlanUsed: true, isPlanActivied: true, planExpiryDate: moment(Date.now()).add(3, 'days') }, function (error: any, updatedUser: any) {
                                    if (err) {
                                        return res.send({
                                            message: 'unauthorized access',
                                            responseCode: 700,
                                            status: 200,
                                            error: err
                                        });
                                    } else {
                                        Payment.create({
                                            txtId: txt,
                                            txtAmount: amount,
                                            planId: planId,
                                            userId: user._id
                                        }, function (error: any, bookmark: any) {
                                            if (error) {
                                                return res.send({
                                                    message: 'Unauthorized DB Error',
                                                    responseCode: 700,
                                                    status: 200,
                                                    error: error
                                                });
                                            } else {
                                                res.status(200).json(
                                                    {
                                                        message: 'Successfully bookmarked',
                                                        responseCode: 2000
                                                    }
                                                );
                                            }

                                        });
                                        return res.send({
                                            message: 'Plan Actived',
                                            responseCode: 200,
                                            status: 200,
                                            user: updatedUser
                                        });
                                    }


                                });
                        }
                    } else {
                        User.updateOne({
                            _id: mongoose.Types.ObjectId(user._id)
                        },
                            { isFreePlanUsed: true, isPlanActivied: true, planExpiryDate: moment(Date.now()).add(months, 'months') }, function (error: any, updatedUser: any) {
                                if (err) {
                                    return res.send({
                                        message: 'unauthorized access',
                                        responseCode: 700,
                                        status: 200,
                                        error: err
                                    });
                                } else {
                                    Payment.create({
                                        txtId: txt,
                                        txtAmount: amount,
                                        planId: planId,
                                        userId: user._id
                                    }, function (error: any, bookmark: any) {
                                        if (error) {
                                            return res.send({
                                                message: 'Unauthorized DB Error',
                                                responseCode: 700,
                                                status: 200,
                                                error: error
                                            });
                                        } else {
                                            return res.send({
                                                message: 'Plan Actived',
                                                responseCode: 200,
                                                status: 200,
                                                user: updatedUser
                                            });
                                        }
                                    })
                                }


                            });
                    }
                }
            })
        }
    }
    allUser = function (req: any, res: any, next: any) {
        var pageSize = parseInt(req.body.pageSize);
        var pageIndex = parseInt(req.body.pageIndex);
        var search = req.body.searchText;
        if (req.body.username == 'bauktion' && req.body.password == 'bauktion@2019') {
            if (pageIndex > 0) {
                if (isNaN(search)) {
                    User.find({ $or: [{ email: { $regex: search, $options: '$i' } }, { fullName: { $regex: search, $options: '$i' } }] }, function (err: any, users: any) {
                        if (err) {
                            return res.send({
                                message: "db err",
                                responseCode: 700,
                                status: 200,
                                error: err
                            })
                        } else {
                            User.find({}, (error: any, totalUsers: any) => {
                                if (err) {
                                    return res.send({
                                        message: "db err",
                                        responseCode: 700,
                                        status: 200,
                                        error: err
                                    })
                                } else {
                                    var usersList = Buffer.from(totalUsers);
                                    var len = usersList.length;
                                    if (users === null) {
                                        return res.send({
                                            message: "no user found",
                                            responseCode: 300,
                                            status: 200,
                                            lenght: len,
                                            users: users
                                        })
                                    } else {
                                        return res.send({
                                            message: "all users",
                                            responseCode: 200,
                                            status: 200,
                                            lenght: len,
                                            users: users
                                        })
                                    }
                                }
                            })
                        }
                    }).limit(pageSize).skip(pageSize * (pageIndex - 1)).sort({ _id: -1 })
                } else if (!search || !search.trim() || search === null || search === '') {
                    User.find({}, function (err: any, users: any) {
                        if (err) {
                            return res.send({
                                message: "db err",
                                responseCode: 700,
                                status: 200,
                                error: err
                            })
                        } else {
                            User.find({}, (error: any, totalUsers: any) => {
                                if (err) {
                                    return res.send({
                                        message: "db err",
                                        responseCode: 700,
                                        status: 200,
                                        error: err
                                    })
                                } else {
                                    var usersList = Buffer.from(totalUsers);
                                    var len = usersList.length;
                                    return res.send({
                                        message: "all users",
                                        responseCode: 200,
                                        status: 200,
                                        lenght: len,
                                        users: users
                                    })
                                }
                            })
                        }
                    }).limit(pageSize).skip(pageSize * (pageIndex - 1)).sort({ _id: -1 })
                } else {
                    User.find({ phoneNumber: Number(search) }, function (err: any, users: any) {
                        if (err) {
                            return res.send({
                                message: "db err",
                                responseCode: 700,
                                status: 200,
                                error: err
                            })
                        } else {
                            User.find({}, (error: any, totalUsers: any) => {
                                if (err) {
                                    return res.send({
                                        message: "db err",
                                        responseCode: 700,
                                        status: 200,
                                        error: err
                                    })
                                } else {
                                    var usersList = Buffer.from(totalUsers);
                                    var len = usersList.length;
                                    if (users === null) {
                                        return res.send({
                                            message: "no user found",
                                            responseCode: 300,
                                            status: 200,
                                            lenght: len,
                                            users: users
                                        })
                                    } else {
                                        return res.send({
                                            message: "all users",
                                            responseCode: 200,
                                            status: 200,
                                            lenght: len,
                                            users: users
                                        })
                                    }
                                }
                            })
                        }
                    }).limit(pageSize).skip(pageSize * (pageIndex - 1)).sort({ _id: -1 })
                }
            } else {
                return res.send({
                    message: "Invalid Pages",
                    responseCode: 101,
                    status: 200
                })
            }
        } else {
            return res.send({
                message: "Invalid Username and Password",
                responseCode: 100,
                status: 200
            })
        }
    }

    sendNotification = function (req: any, res: any, next: any) {
        var user = req.body.data.user;
        var title = req.body.data.title;
        var message = req.body.data.message;
        FirebaseNotification.sendPushNotificaiton(user.id, {
            data: {
                type: "1",
                title: title,
                body: message,
            },
            notification: {
                title: title,
                body: message,
                sound: 'default',
                icon: 'https://admin.bauktion.com/assets/bauktion.png',
            },

        }, {
            priority: 'high',
        }, res);
    }

    mail = function (req: any, res: any, next: any) {
        var user = req.body.data.user;
        var title = req.body.data.title;
        var message = req.body.data.message;
        Mail.adminMail(user.email, title, message).then(() => {
            res.status(200).json(
                {
                    message: 'Successfully Mailed',
                    responseCode: 200
                }
            );
        });
    }

    mailToAll = function (req: any, res: any, next: any) {
        var title = req.body.data.title;
        var message = req.body.data.message;
        var option = req.body.data.type;
        if (option === 'all') {
            User.find(function (error: any, result: any) {
                if (error) {

                } else {
                    result.forEach((user: any) => {
                        Mail.adminMail(user.email, title, message).then((response: any) => {
                            console.log('Successfully sent message:', response);
                        })
                            .catch((error: any) => {
                                console.log('Error sending message:', error);
                            });
                    });
                    res.status(200).json(
                        {
                            message: 'Successfully mail to all ',
                            responseCode: 200
                        }
                    );
                }
            });
        }
        else {
            User.find(function (error: any, result: any) {
                if (error) {

                } else {
                    result.forEach((user: any) => {
                        if (moment(Date.now()).diff(user.planExpiryDate, 'days') >= 0) {
                            Mail.adminMail(user.email, title, message).then((response: any) => {
                                console.log('Successfully sent message:', response);
                            })
                                .catch((error: any) => {
                                    console.log('Error sending message:', error);
                                });
                        }
                    });
                    res.status(200).json(
                        {
                            message: 'Successfully mail',
                            responseCode: 200
                        }
                    );
                }
            });
        }
    }

    addBookmark = function (req: any, res: any, next: any) {
        var token = req.headers.token;
        var pid = req.body.pid;
        if (token) {
            jwt.verify(token, 'your_jwt_secret', (err: any, user: any) => {
                if (err) {
                    return res.send({
                        message: 'unauthorized access',
                        responseCode: 700,
                        status: 200,
                        error: err
                    });
                } else {
                    Bookmark.find({
                        uid: mongoose.Types.ObjectId(user._id),
                        pid: pid,
                    }, (function (error: any, bookmarked: any) {
                        if (error) {
                            return res.send({
                                message: 'Unauthorized DB Error',
                                responseCode: 700,
                                status: 200,
                                error: error
                            });
                        } else {
                            if (bookmarked && bookmarked.length <= 0) {
                                Bookmark.create({
                                    "uid": user._id,
                                    "pid": pid,
                                }, function (error: any, bookmark: any) {
                                    if (error) {
                                        return res.send({
                                            message: 'Unauthorized DB Error',
                                            responseCode: 700,
                                            status: 200,
                                            error: error
                                        });
                                    } else {
                                        res.status(200).json(
                                            {
                                                message: 'Successfully bookmarked',
                                                responseCode: 2000
                                            }
                                        );
                                    }

                                });
                            } else
                                res.status(200).json({
                                    message: 'Already Bookmarked',
                                    responseCode: 2001
                                });
                        }
                    }))

                }
            })
        }
        else {
            return res.send({
                message: 'Token is Required',
                responseCode: 800,
                status: 200,
            });
        }
    }

    forgetPassword(req: any, res: any) {
        const schema = {
            phoneNumber: req.body.phoneNumber
        }

        User.findOne(schema, (error: any, user: any) => {
            if (error) {
                res.send({
                    message: "Undefined DB Error",
                    status: 200,
                    error: error,
                    responseCode: 700
                })
            } else {
                if (!isNullOrUndefined(user)) {
                    otpController.generateOtpViaId(user, res);
                } else {
                    res.send({
                        message: "No Such User Found",
                        status: 200,
                        error: error,
                        responseCode: 1004
                    })
                }
            }
        })
    }

    changePhoneNumber(req: any, res: any) {
        var token = req.headers.token;
        if (token) {
            jwt.verify(token, 'your_jwt_secret', (err: any, user: any) => {
                if (err) {
                    return res.send({
                        message: 'unauthorized access',
                        responseCode: 700,
                        status: 200,
                        error: err
                    });
                } else {
                    User.findOne({ phoneNumber: req.body.phoneNumber }, (error: any, result: any) => {
                        if (error) {
                            return res.send({
                                message: 'unauthorized access',
                                responseCode: 700,
                                status: 200,
                                error: err
                            });
                        } else {
                            if (result != null) {
                                return res.send({
                                    message: 'Phone Number already exists',
                                    responseCode: 900,
                                    status: 200
                                });
                            } else {
                                User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(user._id) }, { $set: { phoneNumber: req.body.phoneNumber } }, { new: true, returnOriginal: false }, (error: any, result: any) => {
                                    if (error) {
                                        return res.send({
                                            message: 'unauthorized access',
                                            responseCode: 700,
                                            status: 200,
                                            error: err
                                        });
                                    } else {
                                        var tokenNew = jwt.sign(JSON.stringify(result), 'your_jwt_secret');
                                        otpController.generateOtp(tokenNew, res);
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
    }

    verifyOTPAndChangePassword(req: any, res: any, next: any) {
        Otp.findOne({ userID: req.body.userID }, (error: any, result: any) => {
            if (error) {
                res.send({
                    message: "Undefined DB Error",
                    error: error,
                    responseCode: 700
                });
            } else {
                if (!isNullOrUndefined(result)) {
                    if (Number(req.body.otp) === Number(result.otp)) {
                        var time = new Date();
                        var tstamp = new Date(result.timestamp);
                        tstamp.setMinutes(tstamp.getMinutes() + 10);

                        if (tstamp < time) {
                            res.send({
                                message: "OTP Expired!",
                                status: 200,
                                responseCode: 1008
                            })
                        } else {
                            bcrypt.hash(req.body.password, 10, function (err: any, hash: any) {
                                if (err) {
                                    res.send({
                                        message: "Undefined DB Error",
                                        error: err,
                                        status: 200,
                                        responseCode: 700
                                    });
                                }
                                User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(result.userID) }, { $set: { password: hash } }, { new: true, returnOriginal: false }, function (err: any, resp: any) {
                                    if (err) {
                                        res.send({
                                            message: "Undefined DB Error",
                                            error: err,
                                            status: 200,
                                            responseCode: 700
                                        });
                                    }
                                    res.status(200).json(
                                        {
                                            message: 'Successfully Changed Password!',
                                            status: 200,
                                            responseCode: 2000,
                                        }
                                    );
                                });
                            })
                        }
                    } else {
                        res.send({
                            message: 'Invaild otp',
                            status: "200",
                            responseCode: 1007
                        });
                    }
                } else {
                    res.json(
                        {
                            message: 'Error while updating password',
                            status: 200,
                            responseCode: 1009
                        }
                    );
                }
            }
        });
    }

    uploadProfileImage(req: any, res: any) {
        var token = req.headers.token;
        if (token) {
            jwt.verify(token, 'your_jwt_secret', (err: any, user: any) => {
                if (err) {
                    return res.send({
                        message: 'unauthorized access',
                        responseCode: 700,
                        status: 200,
                        error: err
                    });
                } else {
                    upload(req, res, (errorMulter: any) => {
                        if (errorMulter) {
                            res.send({
                                message: "Error in multer!",
                                error: errorMulter
                            })
                        } else if (!req.file) {
                            res.send({
                                message: "File not Present!"
                            })
                        } else {
                            var profileImage = req.file.path;
                            User.findOneAndUpdate({ _id: user._id }, { profileImage: profileImage }, { new: true, returnOriginal: false }, (err: any, result: any) => {
                                if (err) {
                                    return res.send({
                                        message: 'unauthorized access',
                                        responseCode: 700,
                                        status: 200,
                                        error: err
                                    });
                                } else {
                                    return res.send({
                                        message: 'Uploaded!',
                                        responseCode: 2000,
                                        status: 200,
                                        result: result
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    }

    changePassword = (req: any, res: any) => {
        var token = req.headers.token;
        if (token) {
            jwt.verify(token, 'your_jwt_secret', (err: any, user: any) => {
                if (err) {
                    return res.send({
                        message: 'unauthorized access',
                        responseCode: 700,
                        status: 200,
                        error: err
                    });
                } else {
                    var oldPassword = req.body.oldPassword;
                    var newPassword = req.body.newPassword;
                    User.findOne({ _id: user._id }, (error: any, userData: any) => {
                        if (error) {
                            return res.send({
                                message: 'unauthorized access',
                                responseCode: 700,
                                status: 200,
                                error: error
                            });
                        } else {
                            bcrypt.compare(oldPassword, userData.password, (error: any, result: any) => {
                                if (result === true) {
                                    bcrypt.hash(newPassword, 10, function (err: any, hash: any) {
                                        if (err) {
                                            res.send({
                                                message: "Undefined DB Error",
                                                error: err,
                                                status: 200,
                                                responseCode: 700
                                            });
                                        } else {
                                            User.findOneAndUpdate({ _id: user._id }, { $set: { password: hash } }, { new: true, returnOriginal: false }, (error: any, result: any) => {
                                                if (err) {
                                                    res.send({
                                                        message: "Undefined DB Error",
                                                        error: err,
                                                        status: 200,
                                                        responseCode: 700
                                                    });
                                                } else {
                                                    return res.send({
                                                        message: 'Password Updated!',
                                                        responseCode: 2000,
                                                        status: 200,
                                                        result: result
                                                    })
                                                }
                                            })
                                        }
                                    })
                                } else {
                                    res.send({
                                        error: 'Current Password doesnt match',
                                        responseCode: "4000",
                                        status: "200"
                                    });
                                }
                            })
                        }
                    })
                }
            })
        }
    }

    referUser(req: any, res: any) {
        var token = req.headers.token;
        if (token) {
            jwt.verify(token, 'your_jwt_secret', (err: any, user: any) => {
                if (err) {
                    return res.send({
                        message: 'unauthorized access',
                        responseCode: 700,
                        status: 200,
                        error: err
                    });
                } else {
                    var schema = {
                        mobile: Number(req.body.mobile),
                        name: req.body.name,
                        referredById: user._id,
                    }
                    Reference.findOne({ mobile: schema.mobile }, (error: any, result: any) => {
                        if (err) {
                            return res.send({
                                message: 'unauthorized access',
                                responseCode: 700,
                                status: 200,
                                error: error
                            });
                        } else {
                            if (result != null) {
                                return res.send({
                                    message: 'User Already Referred by someone',
                                    responseCode: 800,
                                    status: 200
                                });
                            } else {
                                Reference.create(schema, (error: any, reference: any) => {
                                    if (err) {
                                        return res.send({
                                            message: 'unauthorized access',
                                            responseCode: 700,
                                            status: 200,
                                            error: error
                                        });
                                    } else {
                                        User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(user._id) }, { $inc: { reference: 1 } }, { new: true, returnOriginal: false }, (error: any, result: any) => {
                                            if (err) {
                                                return res.send({
                                                    message: 'unauthorized access',
                                                    responseCode: 700,
                                                    status: 200,
                                                    error: error
                                                });
                                            } else {
                                                return res.send({
                                                    message: 'User Reference done',
                                                    responseCode: 2000,
                                                    status: 200,
                                                    reference: reference,
                                                    user: result
                                                });
                                            }
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
    }

    getReferenceById(req: any, res: any) {
        var token = req.headers.token;
        if (token) {
            jwt.verify(token, 'your_jwt_secret', (err: any, user: any) => {
                if (err) {
                    return res.send({
                        message: 'unauthorized access',
                        responseCode: 700,
                        status: 200,
                        error: err
                    });
                } else {
                    Reference.find({ referredById: req.body.userId }, (error: any, result: any) => {
                        if (err) {
                            return res.send({
                                message: 'unauthorized access',
                                responseCode: 700,
                                status: 200,
                                error: err
                            });
                        } else {
                            return res.send({
                                message: 'References By User',
                                responseCode: 2000,
                                status: 200,
                                result: result
                            })
                        }
                    }).sort({ timestamp: -1 })
                }
            })
        }
    }

    getAllReferences(req: any, res: any) {
        var token = req.headers.token;
        if (token) {
            jwt.verify(token, 'your_jwt_secret', (err: any, user: any) => {
                if (err) {
                    return res.send({
                        message: 'unauthorized access',
                        responseCode: 700,
                        status: 200,
                        error: err
                    });
                } else {
                    Reference.aggregate([
                        {
                            $lookup: {
                                from: 'users',
                                as: 'users',
                                localField: "referredById",
                                foreignField: "_id",
                            }
                        },
                        {
                            $sort: {
                                timestamp: -1
                            }
                        }
                    ], (error: any, result: any) => {
                        if (err) {
                            return res.send({
                                message: 'unauthorized access',
                                responseCode: 700,
                                status: 200,
                                error: error
                            });
                        } else {
                            return res.send({
                                message: 'All References',
                                responseCode: 200,
                                status: 200,
                                result: result
                            });
                        }
                    })
                }
            })
        }
    }
}
export const userController = new UserController();