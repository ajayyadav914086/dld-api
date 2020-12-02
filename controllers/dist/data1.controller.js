"use strict";
exports.__esModule = true;
exports.dataController1 = void 0;
var DataEntry = require("../models/dataEntry.model");
var Plan = require("../models/plan.model");
var Payment = require("../models/payment.model");
var CountSchema = require("../models/counts.model");
var readXlsxFile = require("read-excel-file/node");
var request1 = require("request-promise");
var HTMLParser = require("node-html-parser");
var jwt = require("jsonwebtoken");
var fs = require("fs");
var mongoose = require("mongoose");
var download = require("download");
var moment = require("moment");
var dateformat = require("dateformat");
var Data1Controller = /** @class */ (function () {
    function Data1Controller() {
        this.addPost = function (req, res) {
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
                            respondentName: req.body.respondentName,
                            judges: req.body.judges,
                            decidedDate: req.body.decidedDate,
                            importantPoints: req.body.importantPoints,
                            importantPointHindi: req.body.importantPointHindi,
                            importantPointMarathi: req.body.importantPointMarathi,
                            importantPointGujrati: req.body.importantPointGujrati,
                            headNote: req.body.headNote,
                            headNoteHindi: req.body.headNoteHindi,
                            headNoteGujrati: req.body.headNoteGujrati,
                            headNoteMarathi: req.body.headNoteMarathi,
                            result: req.body.result,
                            links: req.body.links,
                            caseReferred: req.body.caseReferred,
                            actsRefered: req.body.actsRefered,
                            fullJudgement: req.body.fullJudgement
                        };
                        DataEntry.create(schema, function (error, result) {
                            if (error) {
                                return res.send({
                                    message: "Unauthorized DB error",
                                    responseCode: 700,
                                    status: 200,
                                    error: error
                                });
                            }
                            else {
                                return res.send({
                                    message: "Data post added successfully",
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
        this.getAllPost = function (req, res) {
            DataEntry.find().exec(function (err, posts) {
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
                        message: "posts",
                        responseCode: 300,
                        status: 200,
                        result: posts
                    });
                }
            });
        };
        this.getPostById = function (req, res) {
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
                        DataEntry.findOne({ _id: mongoose.Types.ObjectId(req.body.postId) }, function (error, result) {
                            if (error) {
                                res.send({
                                    message: "Unauthorized DB error",
                                    error: error,
                                    responseCode: 700
                                });
                            }
                            else {
                                res.send({
                                    message: "postById",
                                    responseCode: 200,
                                    result: result
                                });
                            }
                        });
                    }
                });
            }
        };
    }
    return Data1Controller;
}());
exports["default"] = Data1Controller;
exports.dataController1 = new Data1Controller();
