"use strict";
exports.__esModule = true;
exports.userController = void 0;
var bcrypt = require("bcryptjs");
var util_1 = require("util");
var firebase_config_1 = require("../config/firebase.config");
var mail_config_1 = require("../config/mail.config");
var multer_config_1 = require("../config/multer.config");
var otp_controller_1 = require("./otp.controller");
var User = require("../models/user.model");
var Admin = require("../models/admin.model");
var Reference = require("../models/reference.model");
var Payment = require("../models/payment.model");
var Bookmark = require("../models/bookmark.model");
var Mails = require("../models/mail.model");
var Otp = require("../models/otp.model");
var Count = require("../models/count.model");
var jwt = require("jsonwebtoken");
var mongoose = require("mongoose");
var moment = require("moment");
var Notifications = require("../models/notifications.model");
var Plans = require("../models/plan.model");
var UserController = /** @class */ (function () {
    function UserController() {
        this.addUser = function (req, res, next) {
            var isDoctor = false;
            if (req.body.firebasetoken) {
                var firebasetoken = req.body.firebasetoken;
                if (req.body.fullName &&
                    req.body.state &&
                    req.body.password &&
                    req.body.phoneNumber &&
                    req.body.city) {
                    var userData = {
                        state: req.body.state,
                        password: req.body.password,
                        phoneNumber: req.body.phoneNumber,
                        fullName: req.body.fullName,
                        city: req.body.city
                    };
                    User.aggregate([
                        {
                            $match: {
                                phoneNumber: req.body.phoneNumber
                            }
                        },
                    ]).exec(function (error, user) {
                        if (user.length == 0) {
                            User.create(userData, function (error, user) {
                                if (error) {
                                    return res.send({
                                        message: "Unauthorized DB Error",
                                        responseCode: 700,
                                        status: 200,
                                        error: error
                                    });
                                }
                                else {
                                    var tempUser = user;
                                    var token = jwt.sign(tempUser.toJSON(), "your_jwt_secret");
                                    firebase_config_1["default"].addTokenToFirebaseData(firebasetoken, user._id);
                                    otp_controller_1.otpController.generateOtp(token, res);
                                }
                            });
                        }
                        else {
                            return res.send({
                                message: "PhoneNumber Already Exists",
                                responseCode: 700,
                                status: 200,
                                error: error
                            });
                        }
                    });
                }
                else {
                    return res.send({
                        message: "All fields required",
                        responseCode: 600,
                        status: 200
                    });
                }
            }
            else {
                res.send({
                    message: "firebase token is required",
                    status: "200",
                    responseCode: 900
                });
            }
        };
        this.deleteUser = function (req, res, next) {
            var token = req.headers.token;
            if (token) {
                jwt.verify(token, "your_jwt_secret", function (err, user) {
                    if (err) {
                        return res.send({
                            message: "unauthorized access",
                            responseCode: 700,
                            status: 200,
                            error: err
                        });
                    }
                    else {
                        var user = req.body.data;
                        var value = req.body.value;
                        User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(user) }, { isDeleted: value }, { "new": true }, function (err, user) {
                            if (err) {
                                return res.send({
                                    message: "Unauthorized DB Error",
                                    responseCode: 700,
                                    status: 200,
                                    error: err
                                });
                            }
                            else {
                                return res.send({
                                    message: "User Updated Successfully",
                                    responseCode: 2000,
                                    status: 200,
                                    user: user
                                });
                            }
                        });
                    }
                });
            }
        };
        this.putUser = function (req, res, next) {
            var token = req.headers.token;
            if (token) {
                jwt.verify(token, "your_jwt_secret", function (err, user) {
                    if (err) {
                        return res.send({
                            message: "unauthorized access",
                            responseCode: 700,
                            status: 200,
                            error: err
                        });
                    }
                    else {
                        var user = req.body.data.user;
                        var planExpiryDate = req.body.data.planExpiryDate;
                        User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(user.id) }, { planExpiryDate: planExpiryDate }, { "new": true }, function (err, user) {
                            if (err) {
                                return res.send({
                                    message: "Unauthorized DB Error",
                                    responseCode: 700,
                                    status: 200,
                                    error: err
                                });
                            }
                            else {
                                return res.send({
                                    message: "User Updated Successfully",
                                    responseCode: 2000,
                                    status: 200,
                                    result: user
                                });
                            }
                        });
                    }
                });
            }
        };
        this.editAccount = function (req, res) {
            var token = req.headers.token;
            if (token) {
                jwt.verify(token, "your_jwt_secret", function (err, user) {
                    if (err) {
                        return res.send({
                            message: "unauthorized access",
                            responseCode: 700,
                            status: 200,
                            error: err
                        });
                    }
                    else {
                        User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(user._id) }, { $set: { fullName: req.body.fullName } }, { "new": true, returnOriginal: false }, function (error, result) {
                            if (error) {
                                return res.send({
                                    message: "Unauthorized DB Error",
                                    responseCode: 700,
                                    status: 200,
                                    error: error
                                });
                            }
                            else {
                                return res.send({
                                    message: "User Updated",
                                    responseCode: 2000,
                                    status: 200,
                                    result: result
                                });
                            }
                        });
                    }
                });
            }
        };
        this.getTokenUser = function (req, res) {
            var token = req.headers.token;
            if (token) {
                jwt.verify(token, "your_jwt_secret", function (err, user) {
                    if (err) {
                        return res.send({
                            message: "unauthorized access",
                            responseCode: 700,
                            status: 200,
                            error: err
                        });
                    }
                    else {
                        User.findOne({ _id: mongoose.Types.ObjectId(user._id) }, function (error, result) {
                            if (error) {
                                return res.send({
                                    message: "Unauthorized DB Error",
                                    responseCode: 700,
                                    status: 200,
                                    error: error
                                });
                            }
                            else {
                                return res.send({
                                    message: "User Updated",
                                    responseCode: 2000,
                                    status: 200,
                                    result: result
                                });
                            }
                        });
                    }
                });
            }
        };
        this.token = function (req, res, next) {
            if (req.body.firebasetoken) {
                var firebasetoken = req.body.firebasetoken;
                if (req.body.phoneNumber && req.body.password) {
                    User.aggregate([
                        {
                            $match: {
                                phoneNumber: parseInt(req.body.phoneNumber)
                            }
                        },
                    ]).exec(function (error, user) {
                        if (error) {
                            return res.send({
                                message: "Unauthorized DB Error",
                                responseCode: 700,
                                status: 200,
                                error: error
                            });
                        }
                        else if (user.length == 0) {
                            return res.send({
                                message: "Incorrect Phone Number or password",
                                responseCode: 4000,
                                status: 200
                            });
                        }
                        else {
                            bcrypt.compare(req.body.password, user[0].password, function (error, result) {
                                if (result === true) {
                                    var token = jwt.sign(JSON.stringify(user[0]), "your_jwt_secret");
                                    firebase_config_1["default"].addTokenToFirebaseData(firebasetoken, user[0]._id);
                                    res.send({
                                        token: token,
                                        user: user[0],
                                        responseCode: 2000
                                    });
                                }
                                else {
                                    res.send({
                                        error: "Incorrect Phone Number or password.",
                                        responseCode: 4000,
                                        status: "200"
                                    });
                                }
                            });
                        }
                    });
                }
                else {
                    return res.send({
                        message: "All fields required",
                        responseCode: 600,
                        status: 200
                    });
                }
            }
            else {
                res.send({
                    error: "Firebase token is required",
                    responseCode: "800",
                    status: "200"
                });
            }
        };
        this.getUser = function (req, res, next) {
            var token = req.headers.token;
            var firebasetoken = req.query.firebasetoken;
            if (token) {
                jwt.verify(token, "your_jwt_secret", function (err, user) {
                    if (err) {
                        return res.send({
                            message: "unauthorized access",
                            responseCode: 700,
                            status: 200,
                            error: err
                        });
                    }
                    else {
                        User.findOne({ _id: mongoose.Types.ObjectId(user._id) }, function (err, user) {
                            if (err) {
                                return res.send({
                                    message: "unauthorized access",
                                    responseCode: 700,
                                    status: 200,
                                    error: err
                                });
                            }
                            else {
                                firebase_config_1["default"].addTokenToFirebaseData(firebasetoken, user._id.toString());
                                if (moment(Date.now()).diff(user.planExpiryDate, "days") >= 0) {
                                    User.findByIdAndUpdate({
                                        _id: mongoose.Types.ObjectId(user._id)
                                    }, {
                                        isPlanActivied: false
                                    }, function (error, updatedUser) {
                                        if (error) {
                                            return res.send({
                                                message: "unauthorized db error",
                                                responseCode: 800,
                                                status: 200,
                                                error: err
                                            });
                                        }
                                        else {
                                            User.aggregate([
                                                {
                                                    $match: {
                                                        _id: mongoose.Types.ObjectId(updatedUser._id)
                                                    }
                                                },
                                                {
                                                    $lookup: {
                                                        from: "plans",
                                                        as: "plan",
                                                        localField: "planId",
                                                        foreignField: "_id"
                                                    }
                                                },
                                            ]).exec(function (err, user) {
                                                if (err) {
                                                    return res.send({
                                                        message: "unauthorized db error",
                                                        responseCode: 800,
                                                        status: 200,
                                                        error: err
                                                    });
                                                }
                                                else {
                                                    if (user.length == 0) {
                                                        return res.send({
                                                            message: "no user found",
                                                            responseCode: 900,
                                                            status: 200,
                                                            error: err
                                                        });
                                                    }
                                                    else {
                                                        return res.send({
                                                            message: "user data",
                                                            responseCode: 300,
                                                            status: 200,
                                                            result: user[0]
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                                else {
                                    User.findByIdAndUpdate({
                                        _id: mongoose.Types.ObjectId(user._id)
                                    }, {
                                        isPlanActivied: true
                                    }, function (error, updatedUser) {
                                        if (error) {
                                            return res.send({
                                                message: "unauthorized db error",
                                                responseCode: 800,
                                                status: 200,
                                                error: err
                                            });
                                        }
                                        else {
                                            User.aggregate([
                                                {
                                                    $match: {
                                                        _id: mongoose.Types.ObjectId(updatedUser._id)
                                                    }
                                                },
                                            ]).exec(function (err, user) {
                                                if (err) {
                                                    return res.send({
                                                        message: "unauthorized db error",
                                                        responseCode: 800,
                                                        status: 200,
                                                        error: err
                                                    });
                                                }
                                                else {
                                                    if (user.length == 0) {
                                                        return res.send({
                                                            message: "no user found",
                                                            responseCode: 900,
                                                            status: 200,
                                                            error: err
                                                        });
                                                    }
                                                    else {
                                                        return res.send({
                                                            message: "user data",
                                                            responseCode: 300,
                                                            status: 200,
                                                            result: user[0]
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            }
            else {
                return res.send({
                    message: "Token is Required",
                    responseCode: 800,
                    status: 200
                });
            }
        };
        this.sendNotificationToAll = function (req, res, next) {
            var title = req.body.data.title;
            var message = req.body.data.message;
            var option = req.body.data.type;
            if (option === "all") {
                firebase_config_1["default"].sendPushNotificaitonToAllWithRes({
                    data: {
                        type: "1",
                        title: title,
                        body: message
                    },
                    notification: {
                        title: title,
                        body: message,
                        sound: "default"
                    }
                }, {
                    priority: "high"
                }, res);
            }
            else {
                firebase_config_1["default"].sendPushNotificaitonToAllExpiredWithRes({
                    data: {
                        type: "1",
                        title: title,
                        body: message
                    },
                    notification: {
                        title: title,
                        body: message,
                        sound: "default"
                    }
                }, {
                    priority: "high"
                }, res);
            }
        };
        this.sendNotificationToAllExpired = function (req, res, next) {
            var title = req.body.data.title;
            var message = req.body.data.message;
            firebase_config_1["default"].sendPushNotificaitonToAllExpiredWithRes({
                data: {
                    type: "1",
                    title: title,
                    body: message
                },
                notification: {
                    title: title,
                    body: message,
                    sound: "default"
                }
            }, {
                priority: "high"
            }, res);
        };
        this.getNotifications = function (req, res, next) {
            var pageSize = parseInt(req.query.pageSize);
            var pageIndex = parseInt(req.query.pageIndex);
            var token = req.headers.token;
            if (token) {
                jwt.verify(token, "your_jwt_secret", function (err, user) {
                    if (err) {
                        return res.send({
                            message: "unauthorized access",
                            responseCode: 700,
                            status: 200,
                            error: err
                        });
                    }
                    else {
                        User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(user._id) }, { $set: { notificationCount: 0 } }, { "new": true }, function (err, user) {
                            if (err) {
                                return res.send({
                                    message: "unauthorized access",
                                    responseCode: 700,
                                    status: 200,
                                    error: err
                                });
                            }
                            else {
                                Notifications.aggregate([
                                    {
                                        $match: {
                                            userId: mongoose.Types.ObjectId(user._id)
                                        }
                                    },
                                    { $sort: { _id: -1 } },
                                    { $skip: pageSize * (pageIndex - 1) },
                                    { $limit: pageSize },
                                ]).exec(function (err, notifications) {
                                    if (err) {
                                        return res.send({
                                            message: "unauthorized db error",
                                            responseCode: 800,
                                            status: 200,
                                            error: err
                                        });
                                    }
                                    else {
                                        return res.send({
                                            message: "user notifications",
                                            responseCode: 300,
                                            status: 200,
                                            result: notifications
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
            else {
                return res.send({
                    message: "Token is Required",
                    responseCode: 800,
                    status: 200
                });
            }
        };
        this.adminLogin = function (req, res, next) {
            if (!(req.body.username == "bauktion" && req.body.password == "bauktion@2019")) {
                return res.send({
                    message: "unauthorized access",
                    responseCode: 700,
                    status: 200
                });
            }
            else {
                return res.send({
                    message: "unauthorized access",
                    responseCode: 200,
                    status: 200
                });
            }
        };
        this.viewAllMails = function (req, res, next) {
            // const pageSize = parseInt(req.query.pageSize);
            // const pageIndex = parseInt(req.query.pageIndex);
            if (!(req.body.username == "bauktion" && req.body.password == "bauktion@2019")) {
                return res.send({
                    message: "unauthorized access",
                    responseCode: 700,
                    status: 200
                });
            }
            else {
                Mails.find().exec(function (err, mails) {
                    if (err) {
                        return res.send({
                            message: "unauthorized db error",
                            responseCode: 800,
                            status: 200,
                            error: err
                        });
                    }
                    else {
                        return res.send({
                            message: "mails",
                            responseCode: 300,
                            status: 200,
                            result: mails
                        });
                    }
                });
            }
        };
        this.viewAllBookmark = function (req, res, next) {
            var pageSize = parseInt(req.query.pageSize);
            var pageIndex = parseInt(req.query.pageIndex);
            var token = req.headers.token;
            if (token) {
                jwt.verify(token, "your_jwt_secret", function (err, user) {
                    if (err) {
                        return res.send({
                            message: "unauthorized access",
                            responseCode: 700,
                            status: 200,
                            error: err
                        });
                    }
                    else {
                        if (pageIndex > 0) {
                            Bookmark.aggregate([
                                {
                                    $lookup: {
                                        from: "dataentries",
                                        as: "post",
                                        localField: "pid",
                                        foreignField: "_id"
                                    }
                                },
                                {
                                    $lookup: {
                                        from: "users",
                                        as: "user",
                                        localField: "uid",
                                        foreignField: "_id"
                                    }
                                },
                                { $unwind: "$post" },
                                { $unwind: "$user" },
                                { $skip: pageSize * (pageIndex - 1) },
                                { $limit: pageSize },
                            ]).exec(function (err, bookmarks) {
                                if (err) {
                                    return res.send({
                                        message: "unauthorized db error",
                                        responseCode: 800,
                                        status: 200,
                                        error: err
                                    });
                                }
                                else {
                                    return res.send({
                                        message: "user bookmarks",
                                        responseCode: 300,
                                        status: 200,
                                        result: bookmarks
                                    });
                                }
                            });
                        }
                        else {
                            return res.send({
                                message: "Page Index should pe greater the 0",
                                status: 200,
                                responseCode: 600
                            });
                        }
                    }
                });
            }
        };
        this.viewBookmark = function (req, res, next) {
            var pageSize = parseInt(req.query.pageSize);
            var pageIndex = parseInt(req.query.pageIndex);
            var token = req.headers.token;
            if (token) {
                jwt.verify(token, "your_jwt_secret", function (err, user) {
                    if (err) {
                        return res.send({
                            message: "unauthorized access",
                            responseCode: 700,
                            status: 200,
                            error: err
                        });
                    }
                    else {
                        Bookmark.aggregate([
                            {
                                $match: {
                                    uid: mongoose.Types.ObjectId(user._id)
                                }
                            },
                            {
                                $lookup: {
                                    from: "dataentries",
                                    as: "post",
                                    localField: "pid",
                                    foreignField: "_id"
                                }
                            },
                            { $unwind: "$post" },
                            { $skip: pageSize * (pageIndex - 1) },
                            { $limit: pageSize },
                        ]).exec(function (err, bookmarks) {
                            if (err) {
                                return res.send({
                                    message: "unauthorized db error",
                                    responseCode: 800,
                                    status: 200,
                                    error: err
                                });
                            }
                            else {
                                return res.send({
                                    message: "user bookmarks",
                                    responseCode: 300,
                                    status: 200,
                                    result: bookmarks
                                });
                            }
                        });
                    }
                });
            }
            else {
                return res.send({
                    message: "Token is Required",
                    responseCode: 800,
                    status: 200
                });
            }
        };
        this.removeBookmark = function (req, res, next) {
            var token = req.headers.token;
            var pid = req.body.pid;
            if (token) {
                jwt.verify(token, "your_jwt_secret", function (err, user) {
                    if (err) {
                        return res.send({
                            message: "unauthorized access",
                            responseCode: 700,
                            status: 200,
                            error: err
                        });
                    }
                    else {
                        Bookmark.remove({
                            uid: mongoose.Types.ObjectId(user._id),
                            pid: pid
                        }, function (error, bookmarked) {
                            if (error) {
                                return res.send({
                                    message: "Unauthorized DB Error",
                                    responseCode: 700,
                                    status: 200,
                                    error: error
                                });
                            }
                            else {
                                res.status(200).json({
                                    message: "removed from bookmarked",
                                    responseCode: 2000
                                });
                            }
                        });
                    }
                });
            }
        };
        this.activatePlan = function (req, res, next) {
            var token = req.headers.token;
            var months = req.body.months;
            var isFreePlan = req.body.isFreePlan;
            var txt = req.body.txt;
            var amount = req.body.amount;
            var planId = req.body.planId;
            var planType = req.body.planType;
            var agentId = req.body.agentId;
            if (token) {
                jwt.verify(token, "your_jwt_secret", function (err, user) {
                    if (err) {
                        return res.send({
                            message: "unauthorized access",
                            responseCode: 700,
                            status: 200,
                            error: err
                        });
                    }
                    else {
                        if (isFreePlan) {
                            if (user.isFreePlanUsed) {
                                return res.send({
                                    message: "Free Plan Already Used",
                                    responseCode: 701,
                                    status: 200
                                });
                            }
                            else {
                                Plans.findOne({ _id: mongoose.Types.ObjectId(planId) }, function (error, plan) {
                                    if (err) {
                                        return res.send({
                                            message: "unauthorized access",
                                            responseCode: 700,
                                            status: 200,
                                            error: err
                                        });
                                    }
                                    else {
                                        if (plan.language == 0) {
                                            User.updateOne({
                                                _id: mongoose.Types.ObjectId(user._id)
                                            }, {
                                                planType: planType,
                                                isHindi: false,
                                                isMarathi: false,
                                                isGujarati: false,
                                                isFreePlanUsed: true,
                                                isPlanActivied: true,
                                                planStartDate: Date.now,
                                                planExpiryDate: moment(Date.now()).add(3, "days")
                                            }, function (error, updatedUser) {
                                                if (error) {
                                                    return res.send({
                                                        message: "unauthorized access",
                                                        responseCode: 700,
                                                        status: 200,
                                                        error: err
                                                    });
                                                }
                                                else {
                                                    Payment.create({
                                                        txtId: txt,
                                                        txtAmount: amount,
                                                        planId: planId,
                                                        userId: user._id
                                                    }, function (error, bookmark) {
                                                        if (error) {
                                                            return res.send({
                                                                message: "Unauthorized DB Error",
                                                                responseCode: 700,
                                                                status: 200,
                                                                error: error
                                                            });
                                                        }
                                                        else {
                                                            return res.send({
                                                                message: "Plan Actived",
                                                                responseCode: 200,
                                                                status: 200,
                                                                user: updatedUser
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                        else if (plan.language == 1) {
                                            User.updateOne({
                                                _id: mongoose.Types.ObjectId(user._id)
                                            }, {
                                                planType: planType,
                                                isHindi: true,
                                                isMarathi: false,
                                                isGujarati: false,
                                                isFreePlanUsed: true,
                                                isPlanActivied: true,
                                                planStartDate: Date.now,
                                                planExpiryDate: moment(Date.now()).add(3, "days")
                                            }, function (error, updatedUser) {
                                                if (error) {
                                                    return res.send({
                                                        message: "unauthorized access",
                                                        responseCode: 700,
                                                        status: 200,
                                                        error: err
                                                    });
                                                }
                                                else {
                                                    Payment.create({
                                                        txtId: txt,
                                                        txtAmount: amount,
                                                        planId: planId,
                                                        userId: user._id
                                                    }, function (error, bookmark) {
                                                        if (error) {
                                                            return res.send({
                                                                message: "Unauthorized DB Error",
                                                                responseCode: 700,
                                                                status: 200,
                                                                error: error
                                                            });
                                                        }
                                                        else {
                                                            return res.send({
                                                                message: "Plan Actived",
                                                                responseCode: 200,
                                                                status: 200,
                                                                user: updatedUser
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                        else if (plan.language == 2) {
                                            User.updateOne({
                                                _id: mongoose.Types.ObjectId(user._id)
                                            }, {
                                                planType: planType,
                                                isMarathi: true,
                                                isHindi: false,
                                                isGujarati: false,
                                                isFreePlanUsed: true,
                                                isPlanActivied: true,
                                                planStartDate: Date.now,
                                                planExpiryDate: moment(Date.now()).add(3, "days")
                                            }, function (error, updatedUser) {
                                                if (error) {
                                                    return res.send({
                                                        message: "unauthorized access",
                                                        responseCode: 700,
                                                        status: 200,
                                                        error: err
                                                    });
                                                }
                                                else {
                                                    Payment.create({
                                                        txtId: txt,
                                                        txtAmount: amount,
                                                        planId: planId,
                                                        userId: user._id
                                                    }, function (error, bookmark) {
                                                        if (error) {
                                                            return res.send({
                                                                message: "Unauthorized DB Error",
                                                                responseCode: 700,
                                                                status: 200,
                                                                error: error
                                                            });
                                                        }
                                                        else {
                                                            return res.send({
                                                                message: "Plan Actived",
                                                                responseCode: 200,
                                                                status: 200,
                                                                user: updatedUser
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                        else if (plan.language == 3) {
                                            User.updateOne({
                                                _id: mongoose.Types.ObjectId(user._id)
                                            }, {
                                                planType: planType,
                                                isGujarati: true,
                                                isMarathi: false,
                                                isHindi: false,
                                                isFreePlanUsed: true,
                                                isPlanActivied: true,
                                                planStartDate: Date.now,
                                                planExpiryDate: moment(Date.now()).add(3, "days")
                                            }, function (error, updatedUser) {
                                                if (error) {
                                                    return res.send({
                                                        message: "unauthorized access",
                                                        responseCode: 700,
                                                        status: 200,
                                                        error: err
                                                    });
                                                }
                                                else {
                                                    Payment.create({
                                                        txtId: txt,
                                                        txtAmount: amount,
                                                        planId: planId,
                                                        userId: user._id
                                                    }, function (error, bookmark) {
                                                        if (error) {
                                                            return res.send({
                                                                message: "Unauthorized DB Error",
                                                                responseCode: 700,
                                                                status: 200,
                                                                error: error
                                                            });
                                                        }
                                                        else {
                                                            return res.send({
                                                                message: "Plan Actived",
                                                                responseCode: 200,
                                                                status: 200,
                                                                user: updatedUser
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                        else {
                            Plans.findOne({ _id: mongoose.Types.ObjectId(planId) }, function (error, plan) {
                                if (error) {
                                    return res.send({
                                        message: "unauthorized access",
                                        responseCode: 700,
                                        status: 200,
                                        error: err
                                    });
                                }
                                else {
                                    if (agentId == null) {
                                        if (plan.language == 0) {
                                            User.updateOne({
                                                _id: mongoose.Types.ObjectId(user._id)
                                            }, {
                                                planType: planType,
                                                isHindi: false,
                                                isMarathi: false,
                                                isGujarati: false,
                                                isFreePlanUsed: true,
                                                planStartDate: Date.now,
                                                isPlanActivied: true,
                                                planExpiryDate: moment(Date.now()).add(months, "months")
                                            }, function (error, updatedUser) {
                                                if (error) {
                                                    return res.send({
                                                        message: "unauthorized access",
                                                        responseCode: 700,
                                                        status: 200,
                                                        error: err
                                                    });
                                                }
                                                else {
                                                    Payment.create({
                                                        txtId: txt,
                                                        txtAmount: amount,
                                                        planId: planId,
                                                        userId: user._id
                                                    }, function (error, bookmark) {
                                                        if (error) {
                                                            return res.send({
                                                                message: "Unauthorized DB Error",
                                                                responseCode: 700,
                                                                status: 200,
                                                                error: error
                                                            });
                                                        }
                                                        else {
                                                            return res.send({
                                                                message: "Plan Actived",
                                                                responseCode: 200,
                                                                status: 200,
                                                                user: updatedUser
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                        else if (plan.language == 1) {
                                            User.updateOne({
                                                _id: mongoose.Types.ObjectId(user._id)
                                            }, {
                                                planType: planType,
                                                isHindi: true,
                                                isMarathi: false,
                                                isGujarati: false,
                                                isFreePlanUsed: true,
                                                isPlanActivied: true,
                                                planStartDate: Date.now,
                                                planExpiryDate: moment(Date.now()).add(months, "months")
                                            }, function (error, updatedUser) {
                                                if (error) {
                                                    return res.send({
                                                        message: "unauthorized access",
                                                        responseCode: 700,
                                                        status: 200,
                                                        error: err
                                                    });
                                                }
                                                else {
                                                    Payment.create({
                                                        txtId: txt,
                                                        txtAmount: amount,
                                                        planId: planId,
                                                        userId: user._id
                                                    }, function (error, bookmark) {
                                                        if (error) {
                                                            return res.send({
                                                                message: "Unauthorized DB Error",
                                                                responseCode: 700,
                                                                status: 200,
                                                                error: error
                                                            });
                                                        }
                                                        else {
                                                            return res.send({
                                                                message: "Plan Actived",
                                                                responseCode: 200,
                                                                status: 200,
                                                                user: updatedUser
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                        else if (plan.language == 2) {
                                            User.updateOne({
                                                _id: mongoose.Types.ObjectId(user._id)
                                            }, {
                                                planType: planType,
                                                isMarathi: true,
                                                isHindi: false,
                                                isGujarati: false,
                                                isFreePlanUsed: true,
                                                isPlanActivied: true,
                                                planStartDate: Date.now,
                                                planExpiryDate: moment(Date.now()).add(months, "months")
                                            }, function (error, updatedUser) {
                                                if (error) {
                                                    return res.send({
                                                        message: "unauthorized access",
                                                        responseCode: 700,
                                                        status: 200,
                                                        error: err
                                                    });
                                                }
                                                else {
                                                    Payment.create({
                                                        txtId: txt,
                                                        txtAmount: amount,
                                                        planId: planId,
                                                        userId: user._id
                                                    }, function (error, bookmark) {
                                                        if (error) {
                                                            return res.send({
                                                                message: "Unauthorized DB Error",
                                                                responseCode: 700,
                                                                status: 200,
                                                                error: error
                                                            });
                                                        }
                                                        else {
                                                            return res.send({
                                                                message: "Plan Actived",
                                                                responseCode: 200,
                                                                status: 200,
                                                                user: updatedUser
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                        else if (plan.language == 3) {
                                            User.updateOne({
                                                _id: mongoose.Types.ObjectId(user._id)
                                            }, {
                                                planType: planType,
                                                isGujarati: true,
                                                isMarathi: false,
                                                isHindi: false,
                                                isFreePlanUsed: true,
                                                isPlanActivied: true,
                                                planStartDate: Date.now,
                                                planExpiryDate: moment(Date.now()).add(months, "months")
                                            }, function (error, updatedUser) {
                                                if (error) {
                                                    return res.send({
                                                        message: "unauthorized access",
                                                        responseCode: 700,
                                                        status: 200,
                                                        error: err
                                                    });
                                                }
                                                else {
                                                    Payment.create({
                                                        txtId: txt,
                                                        txtAmount: amount,
                                                        planId: planId,
                                                        userId: user._id
                                                    }, function (error, bookmark) {
                                                        if (error) {
                                                            return res.send({
                                                                message: "Unauthorized DB Error",
                                                                responseCode: 700,
                                                                status: 200,
                                                                error: error
                                                            });
                                                        }
                                                        else {
                                                            return res.send({
                                                                message: "Plan Actived",
                                                                responseCode: 200,
                                                                status: 200,
                                                                user: updatedUser
                                                            });
                                                        }
                                                    });
                                                    //   }
                                                }
                                            });
                                        }
                                    }
                                    else {
                                        Admin.findOne({ agentId: agentId }, function (error, admin) {
                                            if (error) {
                                                return res.send({
                                                    message: "unauthorized access",
                                                    responseCode: 700,
                                                    status: 200,
                                                    error: err
                                                });
                                            }
                                            else {
                                                if (admin != null) {
                                                    if (admin.enabled == false) {
                                                        return res.send({
                                                            message: "Agent Disabled",
                                                            responseCode: 1200,
                                                            status: 200
                                                        });
                                                    }
                                                    else {
                                                        if (plan.language == 0) {
                                                            User.updateOne({
                                                                _id: mongoose.Types.ObjectId(user._id)
                                                            }, {
                                                                planType: planType,
                                                                isHindi: false,
                                                                isMarathi: false,
                                                                isGujarati: false,
                                                                isFreePlanUsed: true,
                                                                planStartDate: Date.now,
                                                                isPlanActivied: true,
                                                                agentId: agentId,
                                                                planExpiryDate: moment(Date.now()).add(months, "months")
                                                            }, function (error, updatedUser) {
                                                                if (err) {
                                                                    return res.send({
                                                                        message: "unauthorized access",
                                                                        responseCode: 700,
                                                                        status: 200,
                                                                        error: err
                                                                    });
                                                                }
                                                                else {
                                                                    Payment.create({
                                                                        txtId: txt,
                                                                        txtAmount: amount,
                                                                        planId: planId,
                                                                        userId: user._id,
                                                                        agentId: agentId,
                                                                        discountValue: admin.discountValue
                                                                    }, function (error, bookmark) {
                                                                        if (error) {
                                                                            return res.send({
                                                                                message: "Unauthorized DB Error",
                                                                                responseCode: 700,
                                                                                status: 200,
                                                                                error: error
                                                                            });
                                                                        }
                                                                        else {
                                                                            return res.send({
                                                                                message: "Plan Actived",
                                                                                responseCode: 200,
                                                                                status: 200,
                                                                                user: updatedUser
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                        else if (plan.language == 1) {
                                                            User.updateOne({
                                                                _id: mongoose.Types.ObjectId(user._id)
                                                            }, {
                                                                planType: planType,
                                                                isHindi: true,
                                                                isMarathi: false,
                                                                isGujarati: false,
                                                                isFreePlanUsed: true,
                                                                isPlanActivied: true,
                                                                agentId: agentId,
                                                                planStartDate: Date.now,
                                                                planExpiryDate: moment(Date.now()).add(months, "months")
                                                            }, function (error, updatedUser) {
                                                                if (err) {
                                                                    return res.send({
                                                                        message: "unauthorized access",
                                                                        responseCode: 700,
                                                                        status: 200,
                                                                        error: err
                                                                    });
                                                                }
                                                                else {
                                                                    Payment.create({
                                                                        txtId: txt,
                                                                        txtAmount: amount,
                                                                        planId: planId,
                                                                        userId: user._id,
                                                                        agentId: agentId,
                                                                        discountValue: admin.discountValue
                                                                    }, function (error, bookmark) {
                                                                        if (error) {
                                                                            return res.send({
                                                                                message: "Unauthorized DB Error",
                                                                                responseCode: 700,
                                                                                status: 200,
                                                                                error: error
                                                                            });
                                                                        }
                                                                        else {
                                                                            return res.send({
                                                                                message: "Plan Actived",
                                                                                responseCode: 200,
                                                                                status: 200,
                                                                                user: updatedUser
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                        else if (plan.language == 2) {
                                                            User.updateOne({
                                                                _id: mongoose.Types.ObjectId(user._id)
                                                            }, {
                                                                planType: planType,
                                                                isMarathi: true,
                                                                isHindi: false,
                                                                isGujarati: false,
                                                                isFreePlanUsed: true,
                                                                isPlanActivied: true,
                                                                agentId: agentId,
                                                                planStartDate: Date.now,
                                                                planExpiryDate: moment(Date.now()).add(months, "months")
                                                            }, function (error, updatedUser) {
                                                                if (error) {
                                                                    return res.send({
                                                                        message: "unauthorized access",
                                                                        responseCode: 700,
                                                                        status: 200,
                                                                        error: err
                                                                    });
                                                                }
                                                                else {
                                                                    Payment.create({
                                                                        txtId: txt,
                                                                        txtAmount: amount,
                                                                        planId: planId,
                                                                        userId: user._id,
                                                                        agentId: agentId,
                                                                        discountValue: admin.discountValue
                                                                    }, function (error, bookmark) {
                                                                        if (error) {
                                                                            return res.send({
                                                                                message: "Unauthorized DB Error",
                                                                                responseCode: 700,
                                                                                status: 200,
                                                                                error: error
                                                                            });
                                                                        }
                                                                        else {
                                                                            return res.send({
                                                                                message: "Plan Actived",
                                                                                responseCode: 200,
                                                                                status: 200,
                                                                                user: updatedUser
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                        else if (plan.language == 3) {
                                                            User.updateOne({
                                                                _id: mongoose.Types.ObjectId(user._id)
                                                            }, {
                                                                planType: planType,
                                                                isGujarati: true,
                                                                isMarathi: false,
                                                                isHindi: false,
                                                                isFreePlanUsed: true,
                                                                isPlanActivied: true,
                                                                agentId: agentId,
                                                                planStartDate: Date.now,
                                                                planExpiryDate: moment(Date.now()).add(months, "months")
                                                            }, function (error, updatedUser) {
                                                                if (error) {
                                                                    return res.send({
                                                                        message: "unauthorized access",
                                                                        responseCode: 700,
                                                                        status: 200,
                                                                        error: err
                                                                    });
                                                                }
                                                                else {
                                                                    Payment.create({
                                                                        txtId: txt,
                                                                        txtAmount: amount,
                                                                        planId: planId,
                                                                        userId: user._id,
                                                                        agentId: agentId,
                                                                        discountValue: admin.discountValue
                                                                    }, function (error, bookmark) {
                                                                        if (error) {
                                                                            return res.send({
                                                                                message: "Unauthorized DB Error",
                                                                                responseCode: 700,
                                                                                status: 200,
                                                                                error: error
                                                                            });
                                                                        }
                                                                        else {
                                                                            return res.send({
                                                                                message: "Plan Actived",
                                                                                responseCode: 200,
                                                                                status: 200,
                                                                                user: updatedUser
                                                                            });
                                                                        }
                                                                    });
                                                                    //   }
                                                                }
                                                            });
                                                        }
                                                    }
                                                }
                                                else {
                                                    return res.send({
                                                        message: "No Agent Id Found",
                                                        responseCode: 900,
                                                        status: 200
                                                    });
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        };
        this.addOnLanguage = function (req, res) {
            var token = req.headers.token;
            var language = req.body.language;
            var status = req.body.status;
            var userId = req.body.userId;
            if (token) {
                jwt.verify(token, "your_jwt_secret", function (err, user) {
                    if (err) {
                        return res.send({
                            message: "unauthorized access",
                            responseCode: 700,
                            status: 200,
                            error: err
                        });
                    }
                    else {
                        if (language == 1) {
                            User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(userId) }, { $set: { isHindi: status } }, { "new": true, returnOriginal: false }, function (error, updatedUser) {
                                if (err) {
                                    return res.send({
                                        message: "unauthorized access",
                                        responseCode: 700,
                                        status: 200,
                                        error: err
                                    });
                                }
                                else {
                                    return res.send({
                                        message: "Updated",
                                        responseCode: 2000,
                                        status: 200,
                                        updatedUser: updatedUser
                                    });
                                }
                            });
                        }
                        else if (language == 2) {
                            User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(userId) }, { $set: { isMarathi: status } }, { "new": true, returnOriginal: false }, function (error, updatedUser) {
                                if (err) {
                                    return res.send({
                                        message: "unauthorized access",
                                        responseCode: 700,
                                        status: 200,
                                        error: err
                                    });
                                }
                                else {
                                    return res.send({
                                        message: "Updated",
                                        responseCode: 2000,
                                        status: 200,
                                        updatedUser: updatedUser
                                    });
                                }
                            });
                        }
                        else if (language == 3) {
                            User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(userId) }, { $set: { isGujarati: status } }, { "new": true, returnOriginal: false }, function (error, updatedUser) {
                                if (err) {
                                    return res.send({
                                        message: "unauthorized access",
                                        responseCode: 700,
                                        status: 200,
                                        error: err
                                    });
                                }
                                else {
                                    return res.send({
                                        message: "Updated",
                                        responseCode: 2000,
                                        status: 200,
                                        updatedUser: updatedUser
                                    });
                                }
                            });
                        }
                    }
                });
            }
        };
        this.allUser = function (req, res, next) {
            var pageSize = parseInt(req.body.pageSize);
            var pageIndex = parseInt(req.body.pageIndex);
            var search = req.body.searchText;
            var token = req.headers.token;
            if (token) {
                jwt.verify(token, "your_jwt_secret", function (err, user) {
                    if (err) {
                        return res.send({
                            message: "unauthorized access",
                            responseCode: 700,
                            status: 200,
                            error: err
                        });
                    }
                    else {
                        if (pageIndex > 0) {
                            if (isNaN(search)) {
                                User.find({
                                    $or: [
                                        { email: { $regex: search, $options: "$i" } },
                                        { fullName: { $regex: search, $options: "$i" } },
                                    ]
                                }, function (err, users) {
                                    if (err) {
                                        return res.send({
                                            message: "db err",
                                            responseCode: 700,
                                            status: 200,
                                            error: err
                                        });
                                    }
                                    else {
                                        User.find({}, function (error, totalUsers) {
                                            if (err) {
                                                return res.send({
                                                    message: "db err",
                                                    responseCode: 700,
                                                    status: 200,
                                                    error: err
                                                });
                                            }
                                            else {
                                                var usersList = Buffer.from(totalUsers);
                                                var len = usersList.length;
                                                if (users === null) {
                                                    return res.send({
                                                        message: "no user found",
                                                        responseCode: 300,
                                                        status: 200,
                                                        lenght: len,
                                                        users: users
                                                    });
                                                }
                                                else {
                                                    return res.send({
                                                        message: "all users",
                                                        responseCode: 200,
                                                        status: 200,
                                                        lenght: len,
                                                        users: users
                                                    });
                                                }
                                            }
                                        });
                                    }
                                })
                                    .limit(pageSize)
                                    .skip(pageSize * (pageIndex - 1))
                                    .sort({ _id: -1 });
                            }
                            else if (!search ||
                                !search.trim() ||
                                search === null ||
                                search === "") {
                                User.find({}, function (err, users) {
                                    if (err) {
                                        return res.send({
                                            message: "db err",
                                            responseCode: 700,
                                            status: 200,
                                            error: err
                                        });
                                    }
                                    else {
                                        User.find({}, function (error, totalUsers) {
                                            if (err) {
                                                return res.send({
                                                    message: "db err",
                                                    responseCode: 700,
                                                    status: 200,
                                                    error: err
                                                });
                                            }
                                            else {
                                                var usersList = Buffer.from(totalUsers);
                                                var len = usersList.length;
                                                return res.send({
                                                    message: "all users",
                                                    responseCode: 200,
                                                    status: 200,
                                                    lenght: len,
                                                    users: users
                                                });
                                            }
                                        });
                                    }
                                })
                                    .limit(pageSize)
                                    .skip(pageSize * (pageIndex - 1))
                                    .sort({ _id: -1 });
                            }
                            else {
                                User.find({ phoneNumber: Number(search) }, function (err, users) {
                                    if (err) {
                                        return res.send({
                                            message: "db err",
                                            responseCode: 700,
                                            status: 200,
                                            error: err
                                        });
                                    }
                                    else {
                                        User.find({}, function (error, totalUsers) {
                                            if (err) {
                                                return res.send({
                                                    message: "db err",
                                                    responseCode: 700,
                                                    status: 200,
                                                    error: err
                                                });
                                            }
                                            else {
                                                var usersList = Buffer.from(totalUsers);
                                                var len = usersList.length;
                                                if (users === null) {
                                                    return res.send({
                                                        message: "no user found",
                                                        responseCode: 300,
                                                        status: 200,
                                                        lenght: len,
                                                        users: users
                                                    });
                                                }
                                                else {
                                                    return res.send({
                                                        message: "all users",
                                                        responseCode: 200,
                                                        status: 200,
                                                        lenght: len,
                                                        users: users
                                                    });
                                                }
                                            }
                                        });
                                    }
                                })
                                    .limit(pageSize)
                                    .skip(pageSize * (pageIndex - 1))
                                    .sort({ _id: -1 });
                            }
                        }
                        else {
                            return res.send({
                                message: "Invalid Pages",
                                responseCode: 101,
                                status: 200
                            });
                        }
                    }
                });
            }
        };
        this.sendNotification = function (req, res, next) {
            var user = req.body.data.user;
            var title = req.body.data.title;
            var message = req.body.data.message;
            firebase_config_1["default"].sendPushNotificaiton(user.id, {
                data: {
                    type: "1",
                    title: title,
                    body: message
                },
                notification: {
                    title: title,
                    body: message,
                    sound: "default",
                    icon: "https://admin.bauktion.com/assets/bauktion.png"
                }
            }, {
                priority: "high"
            }, res);
        };
        this.mail = function (req, res, next) {
            var user = req.body.data.user;
            var title = req.body.data.title;
            var message = req.body.data.message;
            mail_config_1["default"].adminMail(user.email, title, message).then(function () {
                res.status(200).json({
                    message: "Successfully Mailed",
                    responseCode: 200
                });
            });
        };
        this.mailToAll = function (req, res, next) {
            var title = req.body.data.title;
            var message = req.body.data.message;
            var option = req.body.data.type;
            if (option === "all") {
                User.find(function (error, result) {
                    if (error) {
                    }
                    else {
                        result.forEach(function (user) {
                            mail_config_1["default"].adminMail(user.email, title, message)
                                .then(function (response) {
                                console.log("Successfully sent message:", response);
                            })["catch"](function (error) {
                                console.log("Error sending message:", error);
                            });
                        });
                        res.status(200).json({
                            message: "Successfully mail to all ",
                            responseCode: 200
                        });
                    }
                });
            }
            else {
                User.find(function (error, result) {
                    if (error) {
                    }
                    else {
                        result.forEach(function (user) {
                            if (moment(Date.now()).diff(user.planExpiryDate, "days") >= 0) {
                                mail_config_1["default"].adminMail(user.email, title, message)
                                    .then(function (response) {
                                    console.log("Successfully sent message:", response);
                                })["catch"](function (error) {
                                    console.log("Error sending message:", error);
                                });
                            }
                        });
                        res.status(200).json({
                            message: "Successfully mail",
                            responseCode: 200
                        });
                    }
                });
            }
        };
        this.addBookmark = function (req, res, next) {
            var token = req.headers.token;
            var pid = req.body.pid;
            if (token) {
                jwt.verify(token, "your_jwt_secret", function (err, user) {
                    if (err) {
                        return res.send({
                            message: "unauthorized access",
                            responseCode: 700,
                            status: 200,
                            error: err
                        });
                    }
                    else {
                        Bookmark.find({
                            uid: mongoose.Types.ObjectId(user._id),
                            pid: pid
                        }, function (error, bookmarked) {
                            if (error) {
                                return res.send({
                                    message: "Unauthorized DB Error",
                                    responseCode: 700,
                                    status: 200,
                                    error: error
                                });
                            }
                            else {
                                if (bookmarked && bookmarked.length <= 0) {
                                    Bookmark.create({
                                        uid: user._id,
                                        pid: pid
                                    }, function (error, bookmark) {
                                        if (error) {
                                            return res.send({
                                                message: "Unauthorized DB Error",
                                                responseCode: 700,
                                                status: 200,
                                                error: error
                                            });
                                        }
                                        else {
                                            res.status(200).json({
                                                message: "Successfully bookmarked",
                                                responseCode: 2000
                                            });
                                        }
                                    });
                                }
                                else
                                    res.status(200).json({
                                        message: "Already Bookmarked",
                                        responseCode: 2001
                                    });
                            }
                        });
                    }
                });
            }
            else {
                return res.send({
                    message: "Token is Required",
                    responseCode: 800,
                    status: 200
                });
            }
        };
        this.changePassword = function (req, res) {
            var token = req.headers.token;
            if (token) {
                jwt.verify(token, "your_jwt_secret", function (err, user) {
                    if (err) {
                        return res.send({
                            message: "unauthorized access",
                            responseCode: 700,
                            status: 200,
                            error: err
                        });
                    }
                    else {
                        var oldPassword = req.body.oldPassword;
                        var newPassword = req.body.newPassword;
                        User.findOne({ _id: user._id }, function (error, userData) {
                            if (error) {
                                return res.send({
                                    message: "unauthorized access",
                                    responseCode: 700,
                                    status: 200,
                                    error: error
                                });
                            }
                            else {
                                bcrypt.compare(oldPassword, userData.password, function (error, result) {
                                    if (result === true) {
                                        bcrypt.hash(newPassword, 10, function (err, hash) {
                                            if (err) {
                                                res.send({
                                                    message: "Undefined DB Error",
                                                    error: err,
                                                    status: 200,
                                                    responseCode: 700
                                                });
                                            }
                                            else {
                                                User.findOneAndUpdate({ _id: user._id }, { $set: { password: hash } }, { "new": true, returnOriginal: false }, function (error, result) {
                                                    if (err) {
                                                        res.send({
                                                            message: "Undefined DB Error",
                                                            error: err,
                                                            status: 200,
                                                            responseCode: 700
                                                        });
                                                    }
                                                    else {
                                                        return res.send({
                                                            message: "Password Updated!",
                                                            responseCode: 2000,
                                                            status: 200,
                                                            result: result
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    else {
                                        res.send({
                                            error: "Current Password doesnt match",
                                            responseCode: "4000",
                                            status: "200"
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        };
        this.planUpdate = function (req, res) {
            var token = req.headers.token;
            if (token) {
                jwt.verify(token, "your_jwt_secret", function (err, user) {
                    if (err) {
                        return res.send({
                            message: "unauthorized access",
                            responseCode: 700,
                            status: 200,
                            error: err
                        });
                    }
                    else {
                        User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.userId) }, { $set: { planType: req.body.planType } }, { "new": true, returnOriginal: false }, function (error, updatedUser) {
                            if (err) {
                                return res.send({
                                    message: "unauthorized access",
                                    responseCode: 700,
                                    status: 200,
                                    error: err
                                });
                            }
                            else {
                                Plans.findOneAndUpdate({ _id: mongoose.Types.ObjectId(updatedUser.planId) }, { $set: { type: req.body.planType } }, { "new": true, returnOriginal: false }, function (error, plan) {
                                    if (err) {
                                        return res.send({
                                            message: "unauthorized access",
                                            responseCode: 700,
                                            status: 200,
                                            error: err
                                        });
                                    }
                                    else {
                                        return res.send({
                                            message: "Plan Updated",
                                            responseCode: 2000,
                                            status: 200,
                                            plan: plan,
                                            user: updatedUser
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        };
    }
    UserController.prototype.lastIdUpdate = function (req, res) {
        if (req.body.username == "bauktion" &&
            req.body.password == "bauktion@2019") {
            Count.findOneAndUpdate({ _id: mongoose.Types.ObjectId("5e8f760e1c9d44000094bb09") }, { lastId: req.body.lastId }, { returnOriginal: false, "new": true }, function (error, result) {
                if (error) {
                    return res.send({
                        message: "unauthorized db error",
                        responseCode: 800,
                        status: 200,
                        error: error
                    });
                }
                else {
                    return res.send({
                        message: "LastId Updated",
                        responseCode: 2000,
                        status: 200,
                        result: result
                    });
                }
            });
        }
        else {
            return res.send({
                message: "unauthorized access",
                responseCode: 200,
                status: 200
            });
        }
    };
    UserController.prototype.forgetPassword = function (req, res) {
        var schema = {
            phoneNumber: req.body.phoneNumber
        };
        User.findOne(schema, function (error, user) {
            if (error) {
                res.send({
                    message: "Undefined DB Error",
                    status: 200,
                    error: error,
                    responseCode: 700
                });
            }
            else {
                if (!util_1.isNullOrUndefined(user)) {
                    otp_controller_1.otpController.generateOtpViaId(user, res);
                }
                else {
                    res.send({
                        message: "No Such User Found",
                        status: 200,
                        error: error,
                        responseCode: 1004
                    });
                }
            }
        });
    };
    UserController.prototype.changePhoneNumber = function (req, res) {
        var token = req.headers.token;
        if (token) {
            jwt.verify(token, "your_jwt_secret", function (err, user) {
                if (err) {
                    return res.send({
                        message: "unauthorized access",
                        responseCode: 700,
                        status: 200,
                        error: err
                    });
                }
                else {
                    User.findOne({ phoneNumber: req.body.phoneNumber }, function (error, result) {
                        if (error) {
                            return res.send({
                                message: "unauthorized access",
                                responseCode: 700,
                                status: 200,
                                error: err
                            });
                        }
                        else {
                            if (result != null) {
                                return res.send({
                                    message: "Phone Number already exists",
                                    responseCode: 900,
                                    status: 200
                                });
                            }
                            else {
                                User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(user._id) }, { $set: { phoneNumber: req.body.phoneNumber } }, { "new": true, returnOriginal: false }, function (error, result) {
                                    if (error) {
                                        return res.send({
                                            message: "unauthorized access",
                                            responseCode: 700,
                                            status: 200,
                                            error: err
                                        });
                                    }
                                    else {
                                        var tokenNew = jwt.sign(JSON.stringify(result), "your_jwt_secret");
                                        otp_controller_1.otpController.generateOtp(tokenNew, res);
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
    };
    UserController.prototype.verifyOTPAndChangePassword = function (req, res, next) {
        Otp.findOne({ userID: req.body.userID }, function (error, result) {
            if (error) {
                res.send({
                    message: "Undefined DB Error",
                    error: error,
                    responseCode: 700
                });
            }
            else {
                if (!util_1.isNullOrUndefined(result)) {
                    if (Number(req.body.otp) === Number(result.otp)) {
                        var time = new Date();
                        var tstamp = new Date(result.timestamp);
                        tstamp.setMinutes(tstamp.getMinutes() + 10);
                        if (tstamp < time) {
                            res.send({
                                message: "OTP Expired!",
                                status: 200,
                                responseCode: 1008
                            });
                        }
                        else {
                            bcrypt.hash(req.body.password, 10, function (err, hash) {
                                if (err) {
                                    res.send({
                                        message: "Undefined DB Error",
                                        error: err,
                                        status: 200,
                                        responseCode: 700
                                    });
                                }
                                User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(result.userID) }, { $set: { password: hash } }, { "new": true, returnOriginal: false }, function (err, resp) {
                                    if (err) {
                                        res.send({
                                            message: "Undefined DB Error",
                                            error: err,
                                            status: 200,
                                            responseCode: 700
                                        });
                                    }
                                    res.status(200).json({
                                        message: "Successfully Changed Password!",
                                        status: 200,
                                        responseCode: 2000
                                    });
                                });
                            });
                        }
                    }
                    else {
                        res.send({
                            message: "Invaild otp",
                            status: "200",
                            responseCode: 1007
                        });
                    }
                }
                else {
                    res.json({
                        message: "Error while updating password",
                        status: 200,
                        responseCode: 1009
                    });
                }
            }
        });
    };
    UserController.prototype.uploadProfileImage = function (req, res) {
        var token = req.headers.token;
        if (token) {
            jwt.verify(token, "your_jwt_secret", function (err, user) {
                if (err) {
                    return res.send({
                        message: "unauthorized access",
                        responseCode: 700,
                        status: 200,
                        error: err
                    });
                }
                else {
                    multer_config_1["default"](req, res, function (errorMulter) {
                        if (errorMulter) {
                            res.send({
                                message: "Error in multer!",
                                error: errorMulter
                            });
                        }
                        else if (!req.file) {
                            res.send({
                                message: "File not Present!"
                            });
                        }
                        else {
                            var profileImage = req.file.path;
                            User.findOneAndUpdate({ _id: user._id }, { profileImage: profileImage }, { "new": true, returnOriginal: false }, function (err, result) {
                                if (err) {
                                    return res.send({
                                        message: "unauthorized access",
                                        responseCode: 700,
                                        status: 200,
                                        error: err
                                    });
                                }
                                else {
                                    return res.send({
                                        message: "Uploaded!",
                                        responseCode: 2000,
                                        status: 200,
                                        result: result
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    };
    UserController.prototype.referUser = function (req, res) {
        var token = req.headers.token;
        if (token) {
            jwt.verify(token, "your_jwt_secret", function (err, user) {
                if (err) {
                    return res.send({
                        message: "unauthorized access",
                        responseCode: 700,
                        status: 200,
                        error: err
                    });
                }
                else {
                    var schema = {
                        mobile: Number(req.body.mobile),
                        name: req.body.name,
                        referredById: user._id
                    };
                    Reference.findOne({ mobile: schema.mobile }, function (error, result) {
                        if (err) {
                            return res.send({
                                message: "unauthorized access",
                                responseCode: 700,
                                status: 200,
                                error: error
                            });
                        }
                        else {
                            if (result != null) {
                                return res.send({
                                    message: "User Already Referred by someone",
                                    responseCode: 800,
                                    status: 200
                                });
                            }
                            else {
                                Reference.create(schema, function (error, reference) {
                                    if (err) {
                                        return res.send({
                                            message: "unauthorized access",
                                            responseCode: 700,
                                            status: 200,
                                            error: error
                                        });
                                    }
                                    else {
                                        User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(user._id) }, { $inc: { reference: 1 } }, { "new": true, returnOriginal: false }, function (error, result) {
                                            if (err) {
                                                return res.send({
                                                    message: "unauthorized access",
                                                    responseCode: 700,
                                                    status: 200,
                                                    error: error
                                                });
                                            }
                                            else {
                                                return res.send({
                                                    message: "User Reference done",
                                                    responseCode: 2000,
                                                    status: 200,
                                                    reference: reference,
                                                    user: result
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
    };
    UserController.prototype.getReferenceById = function (req, res) {
        var token = req.headers.token;
        if (token) {
            jwt.verify(token, "your_jwt_secret", function (err, user) {
                if (err) {
                    return res.send({
                        message: "unauthorized access",
                        responseCode: 700,
                        status: 200,
                        error: err
                    });
                }
                else {
                    Reference.find({ referredById: req.body.userId }, function (error, result) {
                        if (err) {
                            return res.send({
                                message: "unauthorized access",
                                responseCode: 700,
                                status: 200,
                                error: err
                            });
                        }
                        else {
                            return res.send({
                                message: "References By User",
                                responseCode: 2000,
                                status: 200,
                                result: result
                            });
                        }
                    }).sort({ timestamp: -1 });
                }
            });
        }
    };
    UserController.prototype.getAllReferences = function (req, res) {
        var token = req.headers.token;
        if (token) {
            jwt.verify(token, "your_jwt_secret", function (err, user) {
                if (err) {
                    return res.send({
                        message: "unauthorized access",
                        responseCode: 700,
                        status: 200,
                        error: err
                    });
                }
                else {
                    Reference.aggregate([
                        {
                            $lookup: {
                                from: "users",
                                as: "users",
                                localField: "referredById",
                                foreignField: "_id"
                            }
                        },
                        {
                            $sort: {
                                timestamp: -1
                            }
                        },
                    ], function (error, result) {
                        if (err) {
                            return res.send({
                                message: "unauthorized access",
                                responseCode: 700,
                                status: 200,
                                error: error
                            });
                        }
                        else {
                            return res.send({
                                message: "All References",
                                lenght: Buffer.from(result).length,
                                responseCode: 200,
                                status: 200,
                                result: result
                            });
                        }
                    });
                }
            });
        }
    };
    return UserController;
}());
exports["default"] = UserController;
exports.userController = new UserController();
