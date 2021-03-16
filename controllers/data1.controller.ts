const DataEntry = require("../models/dataEntry.model");
const Plan = require("../models/plan.model");
const Payment = require("../models/payment.model");
// const translate = require('google-translate-api');
const Users = require('../models/user.model');
var textSearch = require('mongoose-text-search');
var pdf = require('html-pdf');
const CountSchema = require("../models/count.model");
import FirebaseNotification from "../config/firebase.config";
import request = require("request");
const readXlsxFile = require("read-excel-file/node");
var request1 = require("request-promise");
var HTMLParser = require("node-html-parser");
const jwt = require("jsonwebtoken");
const fs = require("fs");
var mongoose = require("mongoose");
const download = require("download");
import moment = require("moment");
var dateformat = require("dateformat");
// import translate from 'google-translate-open-api';
var translate = require('translate');
export default class Data1Controller {
  addPost = function (req: any, res: any) {
    var token = req.headers.token;
    if (token) {
      jwt.verify(token, "your_jwt_secret", (err: any, user: any) => {
        if (err) {
          return res.send({
            message: "unauthorized access",
            responseCode: 700,
            status: 200,
            error: err,
          });
        } else {
          DataEntry.find({}, (error: any, posts: any) => {
            if (error) {
              return res.send({
                message: "Unauthorized DB error",
                responseCode: 700,
                status: 200,
                error: error,
              });
            } else {
              DataEntry.find({}, (error: any, priority: any) => {
                if (error) {
                  return res.send({
                    message: "Unauthorized DB error",
                    responseCode: 700,
                    status: 200,
                    error: error,
                  });
                } else {
                  CountSchema.findOne({ _id: mongoose.Types.ObjectId('5feb02231a69ef7cdad89044') }, (error: any, count: any) => {
                    if (error) {
                      return res.send({
                        message: "Unauthorized DB error",
                        responseCode: 700,
                        status: 200,
                        error: error,
                      });
                    } else {
                      var date = new Date();
                      var schema = {
                        pid: posts[0] == null ? 1 : Number(posts[0].pid) + 1,
                        priority: priority[0] == null ? 1 : Number(priority[0].priority) + 1,
                        respondentName: req.body.respondentName,
                        judges: req.body.judges,
                        decidedDate: req.body.decidedDate,
                        importantPoints: req.body.importantPoints,
                        importantPointsHindi: req.body.importantPointsHindi,
                        importantPointsMarathi: req.body.importantPointsMarathi,
                        importantPointsGujrati: req.body.importantPointsGujrati,
                        appelentName: req.body.appelentName,
                        headNote: req.body.headNote,
                        headNoteHindi: req.body.headNoteHindi,
                        headNoteGujrati: req.body.headNoteGujrati,
                        headNoteMarathi: req.body.headNoteMarathi,
                        result: req.body.result,
                        type: req.body.type,
                        resultHindi: req.body.resultHindi,
                        resultMarathi: req.body.resultMarathi,
                        resultGujrati: req.body.resultGujrati,
                        links: req.body.links,
                        caseReffered: req.body.caseReffered,
                        actsReffered: req.body.actsReffered,
                        fullJudgement: req.body.fullJudgement,
                        postType: req.body.postType,
                        inFavourOf: req.body.inFavourOf,
                        courtType: req.body.courtType,
                        courtSubType: req.body.courtSubType,
                        dldId: req.body.postType == 0 ? 'DLD(Civil)-' + String(date.getFullYear()) + '-' + String(count.totalCivil + 1) : 'DLD(Cri)-' + String(date.getFullYear()) + '-' + String(count.totalCriminal + 1)
                      };
                      DataEntry.create(schema, (error: any, result: any) => {
                        if (error) {
                          return res.send({
                            message: "Unauthorized DB error",
                            responseCode: 700,
                            status: 200,
                            error: error,
                          });
                        } else {
                          if (req.body.postType == 0) {
                            CountSchema.findOneAndUpdate({ _id: mongoose.Types.ObjectId('5feb02231a69ef7cdad89044') }, { $inc: { totalCivil: 1 } }, { new: true, returnOriginal: false }, (error: any, countUpdate: any) => {
                              if (error) {
                                return res.send({
                                  message: "Unauthorized DB error",
                                  responseCode: 700,
                                  status: 200,
                                  error: error,
                                });
                              } else {

                                return res.send({
                                  message: "Data post added successfully",
                                  responseCode: 2000,
                                  status: 200,
                                  result: result,
                                });
                              }
                            })
                          } else {
                            CountSchema.findOneAndUpdate({ _id: mongoose.Types.ObjectId('5feb02231a69ef7cdad89044') }, { $inc: { totalCriminal: 1 } }, { new: true, returnOriginal: false }, (error: any, countUpdate: any) => {
                              if (error) {
                                return res.send({
                                  message: "Unauthorized DB error",
                                  responseCode: 700,
                                  status: 200,
                                  error: error,
                                });
                              } else {
                                Notification
                                return res.send({
                                  message: "Data post added successfully",
                                  responseCode: 2000,
                                  status: 200,
                                  result: result,
                                });
                              }
                            })
                          }
                        }
                      });
                    }
                  })
                }
              }).sort({ 'priority': -1 }).limit(1);
            }
          }).sort({ 'pid': -1 }).limit(1).collation({ locale: "en_US", numericOrdering: true });
        }
      });
    }
  };

  enablePost(req: any, res: any) {
    var token = req.headers.token;
    if (token) {
      jwt.verify(token, "your_jwt_secret", (err: any, user: any) => {
        if (err) {
          return res.send({
            message: "unauthorized access",
            responseCode: 700,
            status: 200,
            error: err,
          });
        } else {
          if (req.body.enabled == true) {
            DataEntry.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.postId) }, { $set: { enabled: req.body.enabled } }, { new: true, returnOriginal: false }, (error: any, post: any) => {
              if (error) {
                return res.send({
                  message: "Unauthorized DB error",
                  responseCode: 700,
                  status: 200,
                  error: error,
                });
              } else {
                FirebaseNotification.sendPushNotificaitonToAllWithTopic({
                  data: {
                    type: "1",
                    title: String(post.importantPoints),
                    body: String(post.headNote)
                  },
                  notification: {
                    title: String(post.importantPoints),
                    body: String(post.headNote)
                  }
                }, {
                  priority: 'high',
                });
                return res.send({
                  message: "Post Enabled",
                  responseCode: 2000,
                  status: 200,
                  post: post
                })
              }
            })
          } else {
            DataEntry.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.postId) }, { $set: { enabled: req.body.enabled } }, { new: true, returnOriginal: false }, (error: any, post: any) => {
              if (error) {
                return res.send({
                  message: "Unauthorized DB error",
                  responseCode: 700,
                  status: 200,
                  error: error,
                });
              } else {
                return res.send({
                  message: "Post disabled",
                  responseCode: 2000,
                  status: 200,
                  post: post
                })
              }
            })
          }
        }
      })
    }
  }

  enablePostv2(req: any, res: any) {
    var token = req.headers.token;
    if (token) {
      jwt.verify(token, "your_jwt_secret", (err: any, user: any) => {
        if (err) {
          return res.send({
            message: "unauthorized access",
            responseCode: 700,
            status: 200,
            error: err,
          });
        } else {
          if (req.body.enabled == true) {
            DataEntry.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.postId) }, { $set: { enabled: req.body.enabled } }, { new: true, returnOriginal: false }, (error: any, post: any) => {
              if (error) {
                return res.send({
                  message: "Unauthorized DB error",
                  responseCode: 700,
                  status: 200,
                  error: error,
                });
              } else {
                FirebaseNotification.sendPushNotificaitonToTopic({
                  data: {
                    type: "1",
                    title: String(post.importantPoints),
                    body: String(post.headNote)
                  },
                  notification: {
                    title: String(post.importantPoints),
                    body: String(post.headNote)
                  }
                }, {
                  priority: 'high',
                },
                  post.courtType + '_' + post.type
                );
                return res.send({
                  message: "Post Enabled",
                  responseCode: 2000,
                  status: 200,
                  post: post
                })
              }
            })
          } else {
            DataEntry.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.postId) }, { $set: { enabled: req.body.enabled } }, { new: true, returnOriginal: false }, (error: any, post: any) => {
              if (error) {
                return res.send({
                  message: "Unauthorized DB error",
                  responseCode: 700,
                  status: 200,
                  error: error,
                });
              } else {
                return res.send({
                  message: "Post disabled",
                  responseCode: 2000,
                  status: 200,
                  post: post
                })
              }
            })
          }
        }
      })
    }
  }

  getAllPost = function (req: any, res: any) {
    var token = req.headers.token;
    if (token) {
      jwt.verify(token, "your_jwt_secret", (err: any, user: any) => {
        if (err) {
          return res.send({
            message: "unauthorized access",
            responseCode: 700,
            status: 200,
            error: err,
          });
        } else {
          DataEntry.find().exec(function (err: any, posts: any) {
            if (err) {
              return res.send({
                message: "unauthorized db error",
                responseCode: 800,
                status: 200,
                error: err,
              });
            } else {
              return res.send({
                message: "posts",
                responseCode: 300,
                status: 200,
                result: posts,
              });
            }
          });
        }
      });
    }
  };

  getPostById = function (req: any, res: any) {
    var token = req.headers.token;
    if (token) {
      jwt.verify(token, "your_jwt_secret", (err: any, user: any) => {
        if (err) {
          return res.send({
            message: "unauthorized access",
            responseCode: 700,
            status: 200,
            error: err,
          });
        } else {
          DataEntry.aggregate([
            {
              $match: {
                _id: mongoose.Types.ObjectId(req.body.postId)
              }
            },
            {
              $lookup: {
                from: 'bookmarks',
                as: 'bookmark',
                let: { "userObjId": { "$toObjectId": "$_id" }, pid: '$pid', uid: '$uid' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$pid", "$$userObjId"] },
                          { $eq: [mongoose.Types.ObjectId(user._id), '$uid'] },
                        ]
                      }
                    }
                  }
                ]
              }
            }],
            (error: any, result: any) => {
              if (error) {
                res.send({
                  message: "Unauthorized DB error",
                  error: error,
                  responseCode: 700,
                });
              } else {
                res.send({
                  message: "postById",
                  responseCode: 2000,
                  result: result[0],
                });
              }
            }
          );
        }
      });
    }
  };

  //for angular developers
  getAllData = function (req: any, res: any, next: any) {
    const pageSize = parseInt(req.body.pageSize);
    const pageIndex = parseInt(req.body.pageIndex);
    var token = req.headers.token;
    if (token) {
      jwt.verify(token, "your_jwt_secret", (err: any, user: any) => {
        if (err) {
          return res.send({
            message: "unauthorized access",
            responseCode: 700,
            status: 200,
            error: err,
          });
        } else {
          if (pageIndex > 0) {
            DataEntry.aggregate(
              [
                {
                  "$facet": {
                    "totalData": [
                      { "$sort": { pid: -1 } },
                      { "$skip": pageSize * (pageIndex - 1) },
                      { "$limit": pageSize }
                    ],
                    "totalCount": [
                      { "$count": "count" }
                    ]
                  }
                }
              ],
              function (error: any, data: any) {
                if (error) {
                  return res.send({
                    message: 'Unauthorized DB Error',
                    responseCode: 700,
                    status: 200,
                    error: error
                  });
                } else {
                  return res.send({
                    message: 'All Data',
                    responseCode: 200,
                    status: 200,
                    result: data

                  });

                }
              }).collation({ locale: "en_US", numericOrdering: true });
          } else {
            return res.send({
              message: "Page Index should pe greater the 0",
              status: 200,
              responseCode: 600
            })
          }
        }
      });
    }
  }

  searchData = function (req: any, res: any, next: any) {
    const pageSize = parseInt(req.query.pageSize);
    const pageIndex = parseInt(req.query.pageIndex);
    var token = req.headers.token;
    var search = new RegExp(req.query.search, 'i');
    var dateRange = {};
    var result = {};
    var type = {};
    var postType = {};
    if (req.query.startDate !== '' && req.query.endDate !== '') {
      var startDate = new Date(req.query.startDate);
      var endDate = new Date(req.query.endDate);
      if (startDate && endDate) {
        dateRange = { decidedDate: { $gte: startDate, $lt: endDate } };
      }
    }
    if (req.query.result !== '') {
      result = { result: { '$regex': req.query.result, '$options': 'i' } }
    }
    if (req.query.postType !== '') {
      postType = { postType: req.query.postType }
    }
    if (req.query.type !== '') {
      type = { type: { '$regex': req.query.type, '$options': 'i' } }
    }
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
          Users.findOne({ _id: mongoose.Types.ObjectId(user._id) }, (error: any, userData?: any) => {
            if (error) {
              return res.send({
                message: "unauthorized access",
                responseCode: 700,
                status: 200,
                error: err,
              });
            } else {
              if (pageIndex > 0) {
                if (userData?.planType == 2 && userData.courtType == 2) { //change to 2
                  if (String(req.query.search).trim() == '') {
                    DataEntry.aggregate([
                      {
                        $match: {
                          $and: [
                            {
                              enabled: true
                            },
                            // dateRange,
                            // result,
                            // type,
                            // postType,
                          ]
                        }
                      },
                      {
                        $lookup: {
                          from: 'bookmarks',
                          as: 'bookmark',
                          let: { "userObjId": { "$toObjectId": "$_id" }, pid: '$pid', uid: '$uid' },
                          pipeline: [
                            {
                              $match: {
                                $expr: {
                                  $and: [
                                    { $eq: ["$pid", "$$userObjId"] },
                                    { $eq: [mongoose.Types.ObjectId(user._id), '$uid'] },
                                  ]
                                }
                              }
                            }
                          ]
                        }
                      },
                      {
                        $sort: { priority: -1 }
                      },
                      { $skip: pageSize * (pageIndex - 1) },
                      { $limit: pageSize }], function (error: any, data: any) {
                        if (error) {
                          return res.send({
                            message: 'Unauthorized DB Error',
                            responseCode: 700,
                            status: 200,
                            error: error
                          });
                        } else {
                          return res.send({
                            message: 'All Data',
                            responseCode: 200,
                            lenght: Buffer.from(data).length,
                            status: 200,
                            result: data
                          });
                        }
                      })
                  } else {
                    DataEntry.aggregate([
                      {
                        $search: {
                          'text': {
                            'query': req.query.search,
                            'path': ['respondentName', 'appelentName', 'judges', 'decidedDate', 'importantPoints', 'importantPointsHindi', 'importantPointsMarathi', 'importantPointsGujrati', 'headNote', 'headNoteHindi', 'headNoteGujrati', 'headNoteMarathi', 'result', 'resultHindi', 'resultMarathi', 'resultGujrati']
                          }
                        }
                      },
                      {
                        $match: {
                          $and: [
                            {
                              enabled: true
                            },
                            // dateRange,
                            // result,
                            // type,
                            // postType,
                          ]
                        }
                      },
                      {
                        $lookup: {
                          from: 'bookmarks',
                          as: 'bookmark',
                          let: { "userObjId": { "$toObjectId": "$_id" }, pid: '$pid', uid: '$uid' },
                          pipeline: [
                            {
                              $match: {
                                $expr: {
                                  $and: [
                                    { $eq: ["$pid", "$$userObjId"] },
                                    { $eq: [mongoose.Types.ObjectId(user._id), '$uid'] },
                                  ]
                                }
                              }
                            }
                          ]
                        }
                      },
                      // {
                      //   $sort: { priority: -1 }
                      // },
                      { $skip: pageSize * (pageIndex - 1) },
                      { $limit: pageSize }], function (error: any, data: any) {
                        if (error) {
                          return res.send({
                            message: 'Unauthorized DB Error',
                            responseCode: 700,
                            status: 200,
                            error: error
                          });
                        } else {
                          return res.send({
                            message: 'All Data',
                            responseCode: 200,
                            lenght: Buffer.from(data).length,
                            status: 200,
                            result: data

                          });

                        }
                      }).sort({
                        score: { $meta: 'textScore' }
                      });
                  }
                } else if (userData?.planType == 2) {
                  if (String(req.query.search).trim() == '') {
                    DataEntry.aggregate([
                      {
                        $match: {
                          $and: [
                            {
                              enabled: true
                            },
                            {
                              courtType: userData?.courtType,
                            },
                            // dateRange,
                            // result,
                            // type,
                            // postType,
                          ]
                        }
                      },
                      {
                        $lookup: {
                          from: 'bookmarks',
                          as: 'bookmark',
                          let: { "userObjId": { "$toObjectId": "$_id" }, pid: '$pid', uid: '$uid' },
                          pipeline: [
                            {
                              $match: {
                                $expr: {
                                  $and: [
                                    { $eq: ["$pid", "$$userObjId"] },
                                    { $eq: [mongoose.Types.ObjectId(user._id), '$uid'] },
                                  ]
                                }
                              }
                            }
                          ]
                        }
                      },
                      {
                        $sort: { priority: -1 }
                      },
                      { $skip: pageSize * (pageIndex - 1) },
                      { $limit: pageSize }], function (error: any, data: any) {
                        if (error) {
                          return res.send({
                            message: 'Unauthorized DB Error',
                            responseCode: 700,
                            status: 200,
                            error: error
                          });
                        } else {
                          return res.send({
                            message: 'All Data',
                            responseCode: 200,
                            lenght: Buffer.from(data).length,
                            status: 200,
                            result: data
                          });

                        }
                      });
                  } else {
                    DataEntry.aggregate([
                      {
                        $search: {
                          'text': {
                            'query': req.query.search,
                            'path': ['respondentName', 'appelentName', 'judges', 'decidedDate', 'importantPoints', 'importantPointsHindi', 'importantPointsMarathi', 'importantPointsGujrati', 'headNote', 'headNoteHindi', 'headNoteGujrati', 'headNoteMarathi', 'result', 'resultHindi', 'resultMarathi', 'resultGujrati']
                          }
                        }
                      },
                      {
                        $match: {
                          $and: [
                            {
                              enabled: true
                            },
                            {
                              courtType: userData?.courtType,
                            },
                            // dateRange,
                            // result,
                            // type,
                            // postType,
                          ]
                        }
                      },
                      {
                        $lookup: {
                          from: 'bookmarks',
                          as: 'bookmark',
                          let: { "userObjId": { "$toObjectId": "$_id" }, pid: '$pid', uid: '$uid' },
                          pipeline: [
                            {
                              $match: {
                                $expr: {
                                  $and: [
                                    { $eq: ["$pid", "$$userObjId"] },
                                    { $eq: [mongoose.Types.ObjectId(user._id), '$uid'] },
                                  ]
                                }
                              }
                            }
                          ]
                        }
                      },
                      // {
                      //   $sort: { priority: -1 }
                      // },
                      { $skip: pageSize * (pageIndex - 1) },
                      { $limit: pageSize }], function (error: any, data: any) {
                        if (error) {
                          return res.send({
                            message: 'Unauthorized DB Error',
                            responseCode: 700,
                            status: 200,
                            error: error
                          });
                        } else {
                          return res.send({
                            message: 'All Data',
                            responseCode: 200,
                            lenght: Buffer.from(data).length,
                            status: 200,
                            result: data
                          });

                        }
                      }).sort({
                        score: { $meta: 'textScore' }
                      });
                  }
                  // .sort({ 'priority': -1 }).collation({ locale: "en_US", numericOrdering: true });

                } else {
                  if (String(req.query.search).trim() == '') {
                    DataEntry.aggregate([
                      {
                        $match: {
                          $and: [
                            {
                              enabled: true
                            },
                            {
                              postType: userData?.planType,
                            },
                            {
                              courtType: userData?.courtType,
                            },
                            // dateRange,
                            // result,
                            // type,
                            // postType,
                          ]
                        }
                      },
                      {
                        $lookup: {
                          from: 'bookmarks',
                          as: 'bookmark',
                          let: { "userObjId": { "$toObjectId": "$_id" }, pid: '$pid', uid: '$uid' },
                          pipeline: [
                            {
                              $match: {
                                $expr: {
                                  $and: [
                                    { $eq: ["$pid", "$$userObjId"] },
                                    { $eq: [mongoose.Types.ObjectId(user._id), '$uid'] },
                                  ]
                                }
                              }
                            }
                          ]
                        }
                      },
                      {
                        $sort: { priority: -1 }
                      },
                      { $skip: pageSize * (pageIndex - 1) },
                      { $limit: pageSize }], function (error: any, data: any) {
                        if (error) {
                          return res.send({
                            message: 'Unauthorized DB Error',
                            responseCode: 700,
                            status: 200,
                            error: error
                          });
                        } else {
                          return res.send({
                            message: 'All Data',
                            responseCode: 200,
                            lenght: Buffer.from(data).length,
                            status: 200,
                            result: data
                          });

                        }
                      });
                  } else {
                    DataEntry.aggregate([
                      {
                        $search: {
                          'text': {
                            'query': req.query.search,
                            'path': ['respondentName', 'appelentName', 'judges', 'decidedDate', 'importantPoints', 'importantPointsHindi', 'importantPointsMarathi', 'importantPointsGujrati', 'headNote', 'headNoteHindi', 'headNoteGujrati', 'headNoteMarathi', 'result', 'resultHindi', 'resultMarathi', 'resultGujrati']
                          }
                        }
                      },
                      {
                        $match: {
                          $and: [
                            {
                              enabled: true
                            },
                            {
                              postType: userData?.planType,
                            },
                            {
                              courtType: userData?.courtType,
                            },
                            // dateRange,
                            // result,
                            // type,
                            // postType,
                          ]
                        }
                      },
                      {
                        $lookup: {
                          from: 'bookmarks',
                          as: 'bookmark',
                          let: { "userObjId": { "$toObjectId": "$_id" }, pid: '$pid', uid: '$uid' },
                          pipeline: [
                            {
                              $match: {
                                $expr: {
                                  $and: [
                                    { $eq: ["$pid", "$$userObjId"] },
                                    { $eq: [mongoose.Types.ObjectId(user._id), '$uid'] },
                                  ]
                                }
                              }
                            }
                          ]
                        }
                      },
                      // {
                      //   $sort: { priority: -1 }
                      // },
                      { $skip: pageSize * (pageIndex - 1) },
                      { $limit: pageSize }], function (error: any, data: any) {
                        if (error) {
                          return res.send({
                            message: 'Unauthorized DB Error',
                            responseCode: 700,
                            status: 200,
                            error: error
                          });
                        } else {
                          return res.send({
                            message: 'All Data',
                            responseCode: 200,
                            lenght: Buffer.from(data).length,
                            status: 200,
                            result: data
                          });

                        }
                      }).sort({
                        score: { $meta: 'textScore' }
                      });
                  }
                  // .sort({ 'priority': -1 }).collation({ locale: "en_US", numericOrdering: true });
                }
              }
            }
          });
        }
      });
    }
    else {
      return res.send({
        message: "Page Index should pe greater the 0",
        status: 200,
        responseCode: 600
      })
    }
  }

  searchDatav2 = function (req: any, res: any, next: any) {
    const pageSize = parseInt(req.query.pageSize);
    const pageIndex = parseInt(req.query.pageIndex);
    var token = req.headers.token;
    var search = new RegExp(req.query.search, 'i');
    var dateRange = {};
    var result = {};
    var type = {};
    var postType = {};
    var courtType = {};
    var courtSubType = {};
    var inFavourOf = {};
    if (req.query.startDate !== 'null' && req.query.endDate !== 'null') {
      var startDate = new Date(req.query.startDate);
      var endDate = new Date(req.query.endDate);
      if (startDate && endDate) {
        dateRange = { decidedDate: { $gte: startDate, $lte: endDate } };
      }
    } else if (req.query.startDate !== 'null' && req.query.endDate == 'null') {
      var startDate = new Date(req.query.startDate);
      var endDate = new Date(moment(req.query.startDate).add('1', 'day').toString());
      dateRange = { decidedDate: { $gte: startDate, $lte: endDate } }
    }
    if (req.query.result !== 'null') {
      result = { result: { '$regex': req.query.result, '$options': 'i' } }
    }
    if (req.query.postType !== 'null') {
      postType = { postType: Number(req.query.postType) }
    }
    if (req.query.courtType !== 'null') {
      courtType = { courtType: Number(req.query.courtType) }
    }
    if (req.query.courtSubType !== 'null') {
      courtSubType = { courtSubType: Number(req.query.courtSubType) }
    }
    if (req.query.inFavourOf != 'null') {
      inFavourOf = { inFavourOf: Number(req.query.inFavourOf) }
    }
    if (req.query.type !== 'null') {
      type = { type: { '$regex': req.query.type, '$options': 'i' } }
    }
    console.log(inFavourOf);
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
          Users.findOne({ _id: mongoose.Types.ObjectId(user._id) }, (error: any, userData?: any) => {
            if (error) {
              return res.send({
                message: "unauthorized access",
                responseCode: 700,
                status: 200,
                error: err,
              });
            } else {
              if (pageIndex > 0) {
                if (userData?.planType == 2 && userData.courtType == 2) { //change to 2
                  if (String(req.query.search).trim() == '' || req.query.search == 'null') {
                    DataEntry.aggregate([
                      {
                        "$addFields": {
                          "decidedDate": {
                            "$convert": {
                              "input": "$decidedDate",
                              "to": "date"
                            }
                          }
                        }
                      },
                      {
                        $match: {
                          $and: [
                            {
                              enabled: true
                            },
                            dateRange,
                            result,
                            type,
                            postType,
                            courtType,
                            courtSubType,
                            inFavourOf
                          ]
                        }
                      },

                      {
                        $lookup: {
                          from: 'bookmarks',
                          as: 'bookmark',
                          let: { "userObjId": { "$toObjectId": "$_id" }, pid: '$pid', uid: '$uid' },
                          pipeline: [
                            {
                              $match: {
                                $expr: {
                                  $and: [
                                    { $eq: ["$pid", "$$userObjId"] },
                                    { $eq: [mongoose.Types.ObjectId(user._id), '$uid'] },
                                  ]
                                }
                              }
                            }
                          ]
                        }
                      },
                      {
                        $sort: { priority: -1 }
                      },
                      { $skip: pageSize * (pageIndex - 1) },
                      { $limit: pageSize }], function (error: any, data: any) {
                        if (error) {
                          return res.send({
                            message: 'Unauthorized DB Error',
                            responseCode: 700,
                            status: 200,
                            error: error
                          });
                        } else {
                          return res.send({
                            message: 'All Data',
                            responseCode: 200,
                            lenght: Buffer.from(data).length,
                            status: 200,
                            result: data
                          });
                        }
                      })
                  } else {
                    DataEntry.aggregate([
                      {
                        $search: {
                          'text': {
                            'query': req.query.search,
                            'path': ['respondentName', 'appelentName', 'judges', 'decidedDate', 'importantPoints', 'importantPointsHindi', 'importantPointsMarathi', 'importantPointsGujrati', 'headNote', 'headNoteHindi', 'headNoteGujrati', 'headNoteMarathi', 'result', 'resultHindi', 'resultMarathi', 'resultGujrati']
                          }
                        }
                      },
                      {
                        "$addFields": {
                          "decidedDate": {
                            "$convert": {
                              "input": "$decidedDate",
                              "to": "date"
                            }
                          }
                        }
                      },
                      {
                        $match: {
                          $and: [
                            {
                              enabled: true
                            },
                            dateRange,
                            result,
                            type,
                            postType,
                            courtType,
                            courtSubType,
                            inFavourOf
                          ]
                        }
                      },
                      {
                        $lookup: {
                          from: 'bookmarks',
                          as: 'bookmark',
                          let: { "userObjId": { "$toObjectId": "$_id" }, pid: '$pid', uid: '$uid' },
                          pipeline: [
                            {
                              $match: {
                                $expr: {
                                  $and: [
                                    { $eq: ["$pid", "$$userObjId"] },
                                    { $eq: [mongoose.Types.ObjectId(user._id), '$uid'] },
                                  ]
                                }
                              }
                            }
                          ]
                        }
                      },
                      // {
                      //   $sort: { score: { $meta: "textScore" } }
                      // },
                      { $skip: pageSize * (pageIndex - 1) },
                      { $limit: pageSize }], function (error: any, data: any) {
                        if (error) {
                          return res.send({
                            message: 'Unauthorized DB Error',
                            responseCode: 700,
                            status: 200,
                            error: error
                          });
                        } else {
                          return res.send({
                            message: 'All Data',
                            responseCode: 200,
                            lenght: Buffer.from(data).length,
                            status: 200,
                            result: data

                          });

                        }
                      }).sort({
                        score: { $meta: 'textScore' }
                      });
                  }
                } else if (userData?.planType == 2) {
                  if (String(req.query.search).trim() == '' || req.query.search == 'null') {
                    DataEntry.aggregate([
                      {
                        "$addFields": {
                          "decidedDate": {
                            "$convert": {
                              "input": "$decidedDate",
                              "to": "date"
                            }
                          }
                        }
                      },
                      {
                        $match: {
                          $and: [
                            {
                              enabled: true
                            },
                            {
                              courtType: userData?.courtType,
                            },
                            dateRange,
                            result,
                            type,
                            postType,
                            courtType,
                            courtSubType,
                            inFavourOf
                          ]
                        }
                      },
                      {
                        $lookup: {
                          from: 'bookmarks',
                          as: 'bookmark',
                          let: { "userObjId": { "$toObjectId": "$_id" }, pid: '$pid', uid: '$uid' },
                          pipeline: [
                            {
                              $match: {
                                $expr: {
                                  $and: [
                                    { $eq: ["$pid", "$$userObjId"] },
                                    { $eq: [mongoose.Types.ObjectId(user._id), '$uid'] },
                                  ]
                                }
                              }
                            }
                          ]
                        }
                      },
                      {
                        $sort: { priority: -1 }
                      },
                      { $skip: pageSize * (pageIndex - 1) },
                      { $limit: pageSize }], function (error: any, data: any) {
                        if (error) {
                          return res.send({
                            message: 'Unauthorized DB Error',
                            responseCode: 700,
                            status: 200,
                            error: error
                          });
                        } else {
                          return res.send({
                            message: 'All Data',
                            responseCode: 200,
                            lenght: Buffer.from(data).length,
                            status: 200,
                            result: data
                          });

                        }
                      });
                  } else {
                    DataEntry.aggregate([
                      {
                        $search: {
                          'text': {
                            'query': req.query.search,
                            'path': ['respondentName', 'appelentName', 'judges', 'decidedDate', 'importantPoints', 'importantPointsHindi', 'importantPointsMarathi', 'importantPointsGujrati', 'headNote', 'headNoteHindi', 'headNoteGujrati', 'headNoteMarathi', 'result', 'resultHindi', 'resultMarathi', 'resultGujrati']
                          }
                        }
                      },
                      {
                        "$addFields": {
                          "decidedDate": {
                            "$convert": {
                              "input": "$decidedDate",
                              "to": "date"
                            }
                          }
                        }
                      },
                      {
                        $match: {
                          $and: [
                            {
                              enabled: true
                            },
                            {
                              courtType: userData?.courtType,
                            },
                            dateRange,
                            result,
                            type,
                            postType,
                            courtType,
                            courtSubType,
                            inFavourOf
                          ]
                        }
                      },
                      {
                        $lookup: {
                          from: 'bookmarks',
                          as: 'bookmark',
                          let: { "userObjId": { "$toObjectId": "$_id" }, pid: '$pid', uid: '$uid' },
                          pipeline: [
                            {
                              $match: {
                                $expr: {
                                  $and: [
                                    { $eq: ["$pid", "$$userObjId"] },
                                    { $eq: [mongoose.Types.ObjectId(user._id), '$uid'] },
                                  ]
                                }
                              }
                            }
                          ]
                        }
                      },
                      // {
                      //   $sort: { score: { $meta: "textScore" } }
                      // },
                      { $skip: pageSize * (pageIndex - 1) },
                      { $limit: pageSize }], function (error: any, data: any) {
                        if (error) {
                          return res.send({
                            message: 'Unauthorized DB Error',
                            responseCode: 700,
                            status: 200,
                            error: error
                          });
                        } else {
                          return res.send({
                            message: 'All Data',
                            responseCode: 200,
                            lenght: Buffer.from(data).length,
                            status: 200,
                            result: data
                          });

                        }
                      }).sort({
                        score: { $meta: 'textScore' }
                      });
                  }
                  // .sort({ 'priority': -1 }).collation({ locale: "en_US", numericOrdering: true });

                } else {
                  if (String(req.query.search).trim() == '' || req.query.search == 'null') {
                    DataEntry.aggregate([
                      {
                        "$addFields": {
                          "decidedDate": {
                            "$convert": {
                              "input": "$decidedDate",
                              "to": "date"
                            }
                          }
                        }
                      },
                      {
                        $match: {
                          $and: [
                            {
                              enabled: true
                            },
                            {
                              postType: userData?.planType,
                            },
                            {
                              courtType: userData?.courtType,
                            },
                            dateRange,
                            result,
                            type,
                            postType,
                            courtType,
                            courtSubType,
                            inFavourOf
                          ]
                        }
                      },
                      {
                        $lookup: {
                          from: 'bookmarks',
                          as: 'bookmark',
                          let: { "userObjId": { "$toObjectId": "$_id" }, pid: '$pid', uid: '$uid' },
                          pipeline: [
                            {
                              $match: {
                                $expr: {
                                  $and: [
                                    { $eq: ["$pid", "$$userObjId"] },
                                    { $eq: [mongoose.Types.ObjectId(user._id), '$uid'] },
                                  ]
                                }
                              }
                            }
                          ]
                        }
                      },
                      {
                        $sort: { priority: -1 }
                      },
                      { $skip: pageSize * (pageIndex - 1) },
                      { $limit: pageSize }], function (error: any, data: any) {
                        if (error) {
                          return res.send({
                            message: 'Unauthorized DB Error',
                            responseCode: 700,
                            status: 200,
                            error: error
                          });
                        } else {
                          return res.send({
                            message: 'All Data',
                            responseCode: 200,
                            lenght: Buffer.from(data).length,
                            status: 200,
                            result: data
                          });

                        }
                      });
                  } else {
                    DataEntry.aggregate([
                      {
                        $search: {
                          'text': {
                            'query': req.query.search,
                            'path': ['respondentName', 'appelentName', 'judges', 'decidedDate', 'importantPoints', 'importantPointsHindi', 'importantPointsMarathi', 'importantPointsGujrati', 'headNote', 'headNoteHindi', 'headNoteGujrati', 'headNoteMarathi', 'result', 'resultHindi', 'resultMarathi', 'resultGujrati']
                          }
                        }
                      },
                      {
                        "$addFields": {
                          "decidedDate": {
                            "$convert": {
                              "input": "$decidedDate",
                              "to": "date"
                            }
                          }
                        }
                      },
                      {
                        $match: {
                          $and: [
                            {
                              enabled: true
                            },
                            {
                              postType: userData?.planType,
                            },
                            {
                              courtType: userData?.courtType,
                            },
                            dateRange,
                            result,
                            type,
                            postType,
                            courtType,
                            courtSubType,
                            inFavourOf
                          ]
                        }
                      },
                      {
                        $lookup: {
                          from: 'bookmarks',
                          as: 'bookmark',
                          let: { "userObjId": { "$toObjectId": "$_id" }, pid: '$pid', uid: '$uid' },
                          pipeline: [
                            {
                              $match: {
                                $expr: {
                                  $and: [
                                    { $eq: ["$pid", "$$userObjId"] },
                                    { $eq: [mongoose.Types.ObjectId(user._id), '$uid'] },
                                  ]
                                }
                              }
                            }
                          ]
                        }
                      },
                      // {
                      //   $sort: { score: { $meta: "textScore" } }
                      // },
                      { $skip: pageSize * (pageIndex - 1) },
                      { $limit: pageSize }], function (error: any, data: any) {
                        if (error) {
                          return res.send({
                            message: 'Unauthorized DB Error',
                            responseCode: 700,
                            status: 200,
                            error: error
                          });
                        } else {
                          return res.send({
                            message: 'All Data',
                            responseCode: 200,
                            lenght: Buffer.from(data).length,
                            status: 200,
                            result: data
                          });

                        }
                      }).sort({
                        score: { $meta: 'textScore' }
                      });
                  }
                  // .sort({ 'priority': -1 }).collation({ locale: "en_US", numericOrdering: true });
                }
              }
            }
          });
        }
      });
    }
    else {
      return res.send({
        message: "Page Index should pe greater the 0",
        status: 200,
        responseCode: 600
      })
    }
  }

  async findData(req: any, res: any) {
    await DataEntry.aggregate([
      {
        $search: {
          'text': {
            'query': req.query.search,
            'path': ['respondentName', 'appelentName', 'judges', 'decidedDate', 'importantPoints', 'importantPointsHindi', 'importantPointsMarathi', 'importantPointsGujrati', 'headNote', 'headNoteHindi', 'headNoteGujrati', 'headNoteMarathi', 'result', 'resultHindi', 'resultMarathi', 'resultGujrati', 'caseReffered', 'actsReffered']
          }
        }
      }
    ], (error: any, result: any) => {
      if (error) {
        return res.send({
          message: 'Unauthorized DB Error',
          responseCode: 700,
          status: 200,
          error: error
        });
      } else {
        return res.send({
          message: 'All Data',
          responseCode: 200,
          status: 200,
          result: result
        });

      }
    })
  }

  // htmlToPDF = function (req: any, res: any) {
  //   var token = req.headers.token;
  //   if (token) {
  //     jwt.verify(token, "your_jwt_secret", (err: any, user: any) => {
  //       if (err) {
  //         return res.send({
  //           message: "unauthorized access",
  //           responseCode: 700,
  //           status: 200,
  //           error: err,
  //         });
  //       } else {
  //         Users.findOne({ _id: mongoose.Types.ObjectId(user._id) }, (error: any, userData?: any) => {
  //           if (error) {
  //             return res.send({
  //               message: "unauthorized access",
  //               responseCode: 700,
  //               status: 200,
  //               error: err,
  //             });
  //           } else {
  //             DataEntry.findOne({ _id: mongoose.Types.ObjectId(req.body.postId) }, (error: any, data: any) => {
  //               if (error) {
  //                 return res.send({
  //                   message: "unauthorized access",
  //                   responseCode: 700,
  //                   status: 200,
  //                   error: err,
  //                 });
  //               } else {
  //                 var date = Date.now().toString();
  //                 var options = {
  //                   "format": "A4",
  //                   "border": "20"
  //                 };
  //                 var dldId = '<p style="margin-left:-1px; text-align:center"><span style="font-size:14px"><strong>' + data.dldId + '</strong></span></p>';
  //                 var importantPoints = '<p style="margin-left:-1px"><span style="font-size:14px"><strong>Important Point:&nbsp;&nbsp;</strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">' + data.importantPoints + '</span></span></span></p>';
  //                 var importantPointsHindi = '<p style="margin-left:-1px"><span style="font-size:14px"><strong>महत्वपूर्ण बिंदु:&nbsp;&nbsp;</strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">' + data.importantPointsHindi + '</span></span></span></p>';
  //                 var importantPointsMarathi = '<p style="margin-left:-1px"><span style="font-size:14px"><strong>महत्त्वाचा मुद्दा:&nbsp;&nbsp;</strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">' + data.importantPointsMarathi + '</span></span></span></p>';
  //                 var importantPointsGujrati = '<p style="margin-left:-1px"><span style="font-size:14px"><strong>મહત્વનો મુદ્દો:&nbsp;&nbsp;</strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">' + data.importantPointsGujarati + '</span></span></span></p>';
  //                 var decidedDate = '<p style="margin-left:-1px; text-align:center"><span style="font-size:14px"><strong>DECIDED ON: ' + data.decidedDate + '</strong></span></p>';
  //                 var soi = '<p style="margin-left:-1px; text-align:center"><span style="font-size:14px"><strong>SUPREME COURT OF INDA</strong></span></p>';
  //                 var vs = '<p style="margin-left:-1px; text-align:center"><span style="font-size:14px"><strong>VS</strong></span></p>';
  //                 var appelentName = '<p style="margin-left:-1px; text-align:center"><span style="font-size:14px"><strong>' + data.appelentName + '-APPELLANT</strong></span></p>';
  //                 var judges = '<p style="margin-left:-1px; text-align:center"><span style="font-size:14px"><strong>( Before : ' + data.judges + ', JJ. )</strong></span></p>';
  //                 var headNote = '<p style="margin-left:-1px"><span style="font-size:14px"><strong><span style="color:#00000a; font-family:Times New Roman, sans-serif">Head Point:&nbsp;</span></strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">' + data.headNote + '</span></span></span></p>';
  //                 var headNoteHindi = '<p style="margin-left:-1px"><span style="font-size:14px"><strong><span style="color:#00000a; font-family:Times New Roman, sans-serif">शीर्ष टिप्पणी:&nbsp;</span></strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">' + data.headNoteHindi + '</span></span></span></p>';
  //                 var headNoteMarathi = '<p style="margin-left:-1px"><span style="font-size:14px"><strong><span style="color:#00000a; font-family:Times New Roman, sans-serif">मुख्य टीप:&nbsp;</span></strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">' + data.headNoteMarathi + '</span></span></span></p>';
  //                 var headNoteGujrati = '<p style="margin-left:-1px"><span style="font-size:14px"><strong><span style="color:#00000a; font-family:Times New Roman, sans-serif">મુખ્ય નોંધ:&nbsp;</span></strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">' + data.headNoteGujarati + '</span></span></span></p>';
  //                 var respondentName = '<p style="margin-left:-1px; text-align:center"><span style="font-size:14px"><strong>' + data.respondentName + '-RESPONDENT</strong></span></p>';
  //                 var result = '<p style="margin-left:-1px"><strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">Result:&nbsp;</span></span></span></strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">' + data.result + '</span></span></span></p>';
  //                 var resultHindi = '<p style="margin-left:-1px"><strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">परिणाम:&nbsp;</span></span></span></strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">' + data.resultHindi + '</span></span></span></p>';
  //                 var resultMarathi = '<p style="margin-left:-1px"><strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">परिणाम:&nbsp;</span></span></span></strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">' + data.resultMarathi + '</span></span></span></p>';
  //                 var resultGujrati = '<p style="margin-left:-1px"><strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">પરિણામ:&nbsp;</span></span></span></strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">' + data.resultGujarati + '</span></span></span></p>';
  //                 var caseRefferedText = '<p><span style="font-size:14px"><strong>Case Reffered:&nbsp;</strong></span></p>';
  //                 var caseReffered = '<ul>';
  //                 var caseRefListTag = '<li><span style="font-size:14px"></span></li>'
  //                 var caseRef = data.caseReffered.split('\n');
  //                 var caseRefLenght = Buffer.from(caseRef).length;
  //                 for (var i = 0; i < caseRefLenght; i++) {
  //                   caseReffered = caseReffered + '<li><span style="font-size:14px">' + String(caseRef[i]) + '</span></li>';
  //                 }
  //                 var postType = '<p style="text-align:center"><span style="font-size:14px"><strong>' + data.postType + '</strong></span></p>';
  //                 var type = '<p style="text-align:center"><span style="font-size:16px"><strong>' + data.type + '</strong></span></p>';
  //                 var fullJudgement = data.fullJudgement;
  //                 var html;
  //                 if (userData?.isHindi == true && userData?.isMarathi == true && userData?.isGujarati == true) {
  //                   html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + importantPointsHindi + importantPointsMarathi + importantPointsGujrati + headNote + headNoteHindi + headNoteMarathi + headNoteGujrati + result + resultHindi + resultMarathi + resultGujrati + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
  //                 } else if (userData?.isHindi == true && userData?.isMarathi == true) {
  //                   html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + importantPointsHindi + importantPointsMarathi + headNote + headNoteHindi + headNoteMarathi + result + resultHindi + resultMarathi + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
  //                 } else if (userData?.isHindi == true && userData?.isGujarati == true) {
  //                   html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + importantPointsHindi + importantPointsGujrati + headNote + headNoteHindi + headNoteGujrati + result + resultHindi + resultGujrati + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
  //                 } else if (userData?.isMarathi == true && userData?.isGujarati == true) {
  //                   html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + importantPointsMarathi + importantPointsGujrati + headNote + headNoteMarathi + headNoteGujrati + result + resultMarathi + resultGujrati + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
  //                 } else if (userData?.isMarathi == true) {
  //                   html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + importantPointsMarathi + headNote + headNoteMarathi + result + resultMarathi + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
  //                 } else if (userData?.isGujarati == true) {
  //                   html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + importantPointsGujrati + headNote + headNoteGujrati + result + resultGujrati + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
  //                 } else if (userData?.isHindi == true) {
  //                   html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + importantPointsHindi + headNote + headNoteHindi + result + resultHindi + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
  //                 } else {
  //                   html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + headNote + result + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
  //                 }
  //                 pdf.create(html, options).toFile('./public/pdf/' + String(date) + '.pdf', (error: any, result: any) => {
  //                   if (error) return console.log(error);
  //                   res.send({
  //                     message: 'Created PDF',
  //                     url: 'https://api.dailylawdigest.com/pdf/' + String(date) + '.pdf',
  //                     result: result
  //                   })
  //                 })
  //               }
  //             })
  //           }
  //         })
  //       }
  //     })
  //   }
  // }

  getFullJudgementById = function (req: any, res: any) {
    var token = req.headers.token;
    if (token) {
      jwt.verify(token, "your_jwt_secret", (err: any, user: any) => {
        if (err) {
          return res.send({
            message: "unauthorized access",
            responseCode: 700,
            status: 200,
            error: err,
          });
        } else {
          Users.findOne({ _id: mongoose.Types.ObjectId(user._id) }, (error: any, userData?: any) => {
            if (error) {
              return res.send({
                message: "unauthorized access",
                responseCode: 700,
                status: 200,
                error: err,
              });
            } else {
              DataEntry.aggregate([
                {
                  $match: {
                    _id: mongoose.Types.ObjectId(req.body.postId)
                  }
                },
                {
                  $lookup: {
                    from: 'bookmarks',
                    as: 'bookmark',
                    let: { "userObjId": { "$toObjectId": "$_id" }, pid: '$pid', uid: '$uid' },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $and: [
                              { $eq: ["$pid", "$$userObjId"] },
                              { $eq: [mongoose.Types.ObjectId(user._id), '$uid'] },
                            ]
                          }
                        }
                      }
                    ]
                  }
                }],
                (error: any, dbResult: any) => {
                  if (error) {
                    res.send({
                      message: "Unauthorized DB error",
                      error: error,
                      responseCode: 700,
                    });
                  } else {
                    var data = dbResult[0];
                    var dldId = '<head><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>iframe{display:none;}*{margin-right:0px!important;margin-left:0px!important;}p{margin-top:0px;margin-bottom:0px;overflow-y: hidden;}ol{margin:0px;}body{padding: 0px 8px;}</style><script>setCookie("googtrans", "/en/en"); function testLoad(){document.getElementById("test").innerHTML = document.cookie;} function setCookie(key, value, expiry){ var expires = new Date();expires.setTime(expires.getTime() + (expiry * 24 * 60 * 60 * 1000));document.cookie = key + "=" + value + ";expires=" + expires.toUTCString();}</script></head><body></body><div style="display:none" id="google_translate_element"></div><script>function googleTranslateElementInit() {new google.translate.TranslateElement({pageLanguage: "en"},"google_translate_element");}</script><script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>' + '<p style="margin-left:-1px; margin-bottom: 10px; text-align:center"><span style="font-size:14px"><strong>' + data.dldId + '</strong></span></p>';
                    var importantPoints = '<tbr/><tbr/><p style="margin-left:-1px;text-align:justify"><span id="test" style="font-size:14px"><strong>Important Point:&nbsp;&nbsp;</strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#00B200">' + data.importantPoints + '</span></span></span></p><tbr/>';
                    var importantPointsHindi = '<p style="margin-left:-1px;text-align:justify"><span style="font-size:14px"><strong>महत्वपूर्ण बिंदु:&nbsp;&nbsp;</strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#00B200">' + data.importantPointsHindi + '</span></span></span></p><tbr/>';
                    var importantPointsMarathi = '<p style="margin-left:-1px;text-align:justify"><span style="font-size:14px"><strong>महत्त्वाचा मुद्दा:&nbsp;&nbsp;</strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#00B200">' + data.importantPointsMarathi + '</span></span></span></p><tbr/>';
                    var importantPointsGujrati = '<p style="margin-left:-1px;text-align:justify"><span style="font-size:14px"><strong>મહત્વનો મુદ્દો:&nbsp;&nbsp;</strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#00B200">' + data.importantPointsGujarati + '</span></span></span></p><tbr/>';
                    var decidedDate = '<p style="margin-left:-1px; text-align:center"><span style="font-size:14px"><strong>Decided on: ' + dateformat(new Date(data.decidedDate), "dd-mm-yyyy"); + '</strong></span></p><tbr/>';
                    var soi = '<p style="margin-left:-1px; text-align:center"><span style="font-size:18px"><strong>SUPREME COURT OF INDIA</strong></span></p>';
                    var vs = '<p style="margin-left:-1px; margin-bottom: 10px; margin-top: 10px; text-align:center"><span style="font-size:14px"><strong>VS</strong></span></p>';
                    var appelentName = '<p style="margin-left:-1px; text-align:center"><span style="font-size:14px"><strong>' + data.appelentName + '-APPELLANT</strong></span></p>';
                    var judges = '<p style="margin-left:-1px; text-align:center"><span style="font-size:14px"><strong>( Before : ' + data.judges + ', JJ. )</strong></span></p>';
                    var headNote = '<p style="margin-left:-1px;text-align:justify"><span style="font-size:14px"><strong><span style="color:#00000a; font-family:Times New Roman, sans-serif">Head Point:&nbsp;</span></strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#ff0000">' + data.headNote + '</span></span></span></p><tbr/>';
                    var headNoteHindi = '<p style="margin-left:-1px;text-align:justify"><span style="font-size:14px"><strong><span style="color:#00000a; font-family:Times New Roman, sans-serif">शीर्ष टिप्पणी:&nbsp;</span></strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#ff0000">' + data.headNoteHindi + '</span></span></span></p><tbr/>';
                    var headNoteMarathi = '<p style="margin-left:-1px;text-align:justify"><span style="font-size:14px"><strong><span style="color:#00000a; font-family:Times New Roman, sans-serif">मुख्य टीप:&nbsp;</span></strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#ff0000">' + data.headNoteMarathi + '</span></span></span></p><tbr/>';
                    var headNoteGujrati = '<p style="margin-left:-1px;text-align:justify"><span style="font-size:14px"><strong><span style="color:#00000a; font-family:Times New Roman, sans-serif">મુખ્ય નોંધ:&nbsp;</span></strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#ff0000">' + data.headNoteGujarati + '</span></span></span></p><tbr/>';
                    var respondentName = '<p style="margin-left:-1px; text-align:center"><span style="font-size:14px"><strong>' + data.respondentName + '-RESPONDENT</strong></span></p>';
                    var result = '<p style="margin-left:-1px;text-align:justify"><strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">Result:&nbsp;</span></span></span></strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">' + data.result + '</span></span></span></p>';
                    var resultHindi = '<tbr/><p style="margin-left:-1px;text-align:justify"><strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">परिणाम:&nbsp;</span></span></span></strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">' + data.resultHindi + '</span></span></span></p>';
                    var resultMarathi = '<tbr/><p style="margin-left:-1px;text-align:justify"><strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">परिणाम:&nbsp;</span></span></span></strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">' + data.resultMarathi + '</span></span></span></p>';
                    var resultGujrati = '<tbr/><p style="margin-left:-1px;text-align:justify"><strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">પરિણામ:&nbsp;</span></span></span></strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">' + data.resultGujarati + '</span></span></span></p>';
                    var caseRefferedText = '<tbr/><p><span style="font-size:14px"><strong>Case Reffered:&nbsp;</strong></span></p>';
                    var caseReffered = '<ul>';
                    var caseRefListTag = '<li><span style="font-size:14px;text-align:justify"></span></li>'
                    if (data.caseReffered == null || data.caseReffered == null) {
                      caseReffered = '';
                    } else {
                      var caseRef = data.caseReffered.split('\n\n');
                      var caseRefLenght = Buffer.from(caseRef).length;
                      for (var i = 0; i < caseRefLenght; i++) {
                        caseReffered = caseReffered + '<li><span style="font-size:14px">' + String(caseRef[i]) + '</span></li>';
                      }
                    }
                    var postType = '<p style="text-align:center"><span style="font-size:14px"><strong>' + data.postType + '</strong></span></p>';
                    var type = '<p style="text-align:center"><span style="font-size:16px"><strong>' + data.type + '</strong></span></p>';
                    var fullJudgement = data.fullJudgement;
                    var html;
                    if (userData?.isHindi == true && userData?.isMarathi == true && userData?.isGujarati == true) {
                      html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + String(data.importantPointsHindi == (undefined || null) ? '' : importantPointsHindi) + String(data.importantPointsMarathi == (undefined || null) ? '' : importantPointsMarathi) + String(data.importantPointsGujarati == (undefined || null) ? '' : importantPointsGujrati) + headNote + String(data.headNoteHindi == (undefined || null) ? '' : headNoteHindi) + String(data.headNoteMarathi == (undefined || null) ? '' : headNoteMarathi) + String(data.headNoteGujarati == (undefined || null) ? '' : headNoteGujrati) + result + String(data.resultHindi == (undefined || null) ? '' : resultHindi) + String(data.resultMarathi == (undefined || null) ? '' : resultMarathi) + String(data.resultGujarati == (undefined || null) ? '' : resultGujrati) + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
                    } else if (userData?.isHindi == true && userData?.isMarathi == true) {
                      html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + String(data.importantPointsHindi == (undefined || null) ? '' : importantPointsHindi) + String(data.importantPointsMarathi == (undefined || null) ? '' : importantPointsMarathi) + headNote + String(data.headNoteHindi == (undefined || null) ? '' : headNoteHindi) + String(data.headNoteMarathi == (undefined || null) ? '' : headNoteMarathi) + result + String(data.resultHindi == (undefined || null) ? '' : resultHindi) + String(data.resultMarathi == (undefined || null) ? '' : resultMarathi) + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
                    } else if (userData?.isHindi == true && userData?.isGujarati == true) {
                      html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + String(data.importantPointsHindi == (undefined || null) ? '' : importantPointsHindi) + String(data.importantPointsGujarati == (undefined || null) ? '' : importantPointsGujrati) + headNote + String(data.headNoteHindi == (undefined || null) ? '' : headNoteHindi) + String(data.headNoteGujarati == (undefined || null) ? '' : headNoteGujrati) + result + String(data.resultHindi == (undefined || null) ? '' : resultHindi) + String(data.resultGujarati == (undefined || null) ? '' : resultGujrati) + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
                    } else if (userData?.isMarathi == true && userData?.isGujarati == true) {
                      html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + String(data.importantPointsMarathi == (undefined || null) ? '' : importantPointsMarathi) + String(data.importantPointsGujarati == (undefined || null) ? '' : importantPointsGujrati) + headNote + String(data.headNoteMarathi == (undefined || null) ? '' : headNoteMarathi) + String(data.headNoteGujarati == (undefined || null) ? '' : headNoteGujrati) + result + String(data.resultMarathi == (undefined || null) ? '' : resultMarathi) + String(data.resultGujarati == (undefined || null) ? '' : resultGujrati) + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
                    } else if (userData?.isMarathi == true) {
                      html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + String(data.importantPointsMarathi == (undefined || null) ? '' : importantPointsMarathi) + headNote + String(data.headNoteMarathi == (undefined || null) ? '' : headNoteMarathi) + result + String(data.resultMarathi == (undefined || null) ? '' : resultMarathi) + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
                    } else if (userData?.isGujarati == true) {
                      html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + String(data.importantPointsGujarati == (undefined || null) ? '' : importantPointsGujrati) + headNote + String(data.headNoteGujarati == (undefined || null) ? '' : headNoteGujrati) + result + String(data.resultGujarati == (undefined || null) ? '' : resultGujrati) + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
                    } else if (userData?.isHindi == true) {
                      html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + String(data.importantPointsHindi == (undefined || null) ? '' : importantPointsHindi) + headNote + String(data.headNoteHindi == (undefined || null) ? '' : headNoteHindi) + result + String(data.resultHindi == (undefined || null) ? '' : resultHindi) + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
                    } else {
                      html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + headNote + result + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
                    }
                    res.send({
                      message: "postById",
                      responseCode: 2000,
                      result: dbResult[0],
                      html: html
                    });
                  }
                }
              );

              // DataEntry.aggregate([
              //   {
              //     $match: { _id: mongoose.Types.ObjectId(req.body.postId) }
              //   },
              //   {
              //     $lookup: {
              //       from: 'bookmarks',
              //       as: 'bookmark',
              //       let: { "userObjId": { "$toObjectId": "$_id" }, pid: '$pid', uid: '$uid' },
              //       pipeline: [
              //         {
              //           $match: {
              //             $expr: {
              //               $and: [
              //                 { $eq: ["$pid", "$$userObjId"] },
              //                 { $eq: [mongoose.Types.ObjectId(user._id), '$uid'] },
              //               ]
              //             }
              //           }
              //         }
              //       ]
              //     }
              //   }], function (error: any, data: any) {
              //     if (error) {
              //       return res.send({
              //         message: "unauthorized access",
              //         responseCode: 700,
              //         status: 200,
              //         error: err,
              //       });
              //     } else {
              //       var dldId = '<head><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>iframe{display:none;}*{margin-right:0px!important}p{margin-top:0px;margin-bottom:0px;overflow-y: hidden;}ol{margin:0px;}body{padding: 0px 12px;}</style><script>setCookie("googtrans", "/en/en"); function testLoad(){document.getElementById("test").innerHTML = document.cookie;} function setCookie(key, value, expiry){ var expires = new Date();expires.setTime(expires.getTime() + (expiry * 24 * 60 * 60 * 1000));document.cookie = key + "=" + value + ";expires=" + expires.toUTCString();}</script></head><body></body><div style="display:none" id="google_translate_element"></div><script>function googleTranslateElementInit() {new google.translate.TranslateElement({pageLanguage: "en"},"google_translate_element");}</script><script src="http://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>' + '<p style="margin-left:-1px; margin-bottom: 10px; text-align:center"><span style="font-size:14px"><strong>' + data.dldId + '</strong></span></p>';
              //       var importantPoints = '<tbr/><tbr/><p style="margin-left:-1px;text-align:justify"><span id="test" style="font-size:14px"><strong>Important Point:&nbsp;&nbsp;</strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#00B200">' + data.importantPoints + '</span></span></span></p><tbr/>';
              //       var importantPointsHindi = '<p style="margin-left:-1px;text-align:justify"><span style="font-size:14px"><strong>महत्वपूर्ण बिंदु:&nbsp;&nbsp;</strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#00B200">' + data.importantPointsHindi + '</span></span></span></p><tbr/>';
              //       var importantPointsMarathi = '<p style="margin-left:-1px;text-align:justify"><span style="font-size:14px"><strong>महत्त्वाचा मुद्दा:&nbsp;&nbsp;</strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#00B200">' + data.importantPointsMarathi + '</span></span></span></p><tbr/>';
              //       var importantPointsGujrati = '<p style="margin-left:-1px;text-align:justify"><span style="font-size:14px"><strong>મહત્વનો મુદ્દો:&nbsp;&nbsp;</strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#00B200">' + data.importantPointsGujarati + '</span></span></span></p><tbr/>';
              //       var decidedDate = '<p style="margin-left:-1px; text-align:center"><span style="font-size:14px"><strong>Decided on: ' + dateformat(new Date(data.decidedDate), "dd-mm-yyyy"); + '</strong></span></p><tbr/>';
              //       var soi = '<p style="margin-left:-1px; text-align:center"><span style="font-size:18px"><strong>SUPREME COURT OF INDIA</strong></span></p>';
              //       var vs = '<p style="margin-left:-1px; margin-bottom: 10px; margin-top: 10px; text-align:center"><span style="font-size:14px"><strong>VS</strong></span></p>';
              //       var appelentName = '<p style="margin-left:-1px; text-align:center"><span style="font-size:14px"><strong>' + data.appelentName + '-APPELLANT</strong></span></p>';
              //       var judges = '<p style="margin-left:-1px; text-align:center"><span style="font-size:14px"><strong>( Before : ' + data.judges + ', JJ. )</strong></span></p>';
              //       var headNote = '<p style="margin-left:-1px;text-align:justify"><span style="font-size:14px"><strong><span style="color:#00000a; font-family:Times New Roman, sans-serif">Head Point:&nbsp;</span></strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#ff0000">' + data.headNote + '</span></span></span></p><tbr/>';
              //       var headNoteHindi = '<p style="margin-left:-1px;text-align:justify"><span style="font-size:14px"><strong><span style="color:#00000a; font-family:Times New Roman, sans-serif">शीर्ष टिप्पणी:&nbsp;</span></strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#ff0000">' + data.headNoteHindi + '</span></span></span></p><tbr/>';
              //       var headNoteMarathi = '<p style="margin-left:-1px;text-align:justify"><span style="font-size:14px"><strong><span style="color:#00000a; font-family:Times New Roman, sans-serif">मुख्य टीप:&nbsp;</span></strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#ff0000">' + data.headNoteMarathi + '</span></span></span></p><tbr/>';
              //       var headNoteGujrati = '<p style="margin-left:-1px;text-align:justify"><span style="font-size:14px"><strong><span style="color:#00000a; font-family:Times New Roman, sans-serif">મુખ્ય નોંધ:&nbsp;</span></strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#ff0000">' + data.headNoteGujarati + '</span></span></span></p><tbr/>';
              //       var respondentName = '<p style="margin-left:-1px; text-align:center"><span style="font-size:14px"><strong>' + data.respondentName + '-RESPONDENT</strong></span></p>';
              //       var result = '<p style="margin-left:-1px;text-align:justify"><strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">Result:&nbsp;</span></span></span></strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">' + data.result + '</span></span></span></p>';
              //       var resultHindi = '<tbr/><p style="margin-left:-1px;text-align:justify"><strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">परिणाम:&nbsp;</span></span></span></strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">' + data.resultHindi + '</span></span></span></p>';
              //       var resultMarathi = '<tbr/><p style="margin-left:-1px;text-align:justify"><strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">परिणाम:&nbsp;</span></span></span></strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">' + data.resultMarathi + '</span></span></span></p>';
              //       var resultGujrati = '<tbr/><p style="margin-left:-1px;text-align:justify"><strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">પરિણામ:&nbsp;</span></span></span></strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">' + data.resultGujarati + '</span></span></span></p>';
              //       var caseRefferedText = '<tbr/><p><span style="font-size:14px"><strong>Case Reffered:&nbsp;</strong></span></p>';
              //       var caseReffered = '<ul>';
              //       var caseRefListTag = '<li><span style="font-size:14px;text-align:justify"></span></li>'
              //       if (data.caseReffered == null || data.caseReffered == null) {
              //         caseReffered = '';
              //       } else {
              //         var caseRef = data.caseReffered.split('\n\n');
              //         var caseRefLenght = Buffer.from(caseRef).length;
              //         for (var i = 0; i < caseRefLenght; i++) {
              //           caseReffered = caseReffered + '<li><span style="font-size:14px">' + String(caseRef[i]) + '</span></li>';
              //         }
              //       }
              //       var postType = '<p style="text-align:center"><span style="font-size:14px"><strong>' + data.postType + '</strong></span></p>';
              //       var type = '<p style="text-align:center"><span style="font-size:16px"><strong>' + data.type + '</strong></span></p>';
              //       var fullJudgement = data.fullJudgement;
              //       var html;
              //       if (userData?.isHindi == true && userData?.isMarathi == true && userData?.isGujarati == true) {
              //         html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + String(data.importantPointsHindi == (undefined || null) ? '' : importantPointsHindi) + String(data.importantPointsMarathi == (undefined || null) ? '' : importantPointsMarathi) + String(data.importantPointsGujarati == (undefined || null) ? '' : importantPointsGujrati) + headNote + String(data.headNoteHindi == (undefined || null) ? '' : headNoteHindi) + String(data.headNoteMarathi == (undefined || null) ? '' : headNoteMarathi) + String(data.headNoteGujarati == (undefined || null) ? '' : headNoteGujrati) + result + String(data.resultHindi == (undefined || null) ? '' : resultHindi) + String(data.resultMarathi == (undefined || null) ? '' : resultMarathi) + String(data.resultGujarati == (undefined || null) ? '' : resultGujrati) + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
              //       } else if (userData?.isHindi == true && userData?.isMarathi == true) {
              //         html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + String(data.importantPointsHindi == (undefined || null) ? '' : importantPointsHindi) + String(data.importantPointsMarathi == (undefined || null) ? '' : importantPointsMarathi) + headNote + String(data.headNoteHindi == (undefined || null) ? '' : headNoteHindi) + String(data.headNoteMarathi == (undefined || null) ? '' : headNoteMarathi) + result + String(data.resultHindi == (undefined || null) ? '' : resultHindi) + String(data.resultMarathi == (undefined || null) ? '' : resultMarathi) + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
              //       } else if (userData?.isHindi == true && userData?.isGujarati == true) {
              //         html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + String(data.importantPointsHindi == (undefined || null) ? '' : importantPointsHindi) + String(data.importantPointsGujarati == (undefined || null) ? '' : importantPointsGujrati) + headNote + String(data.headNoteHindi == (undefined || null) ? '' : headNoteHindi) + String(data.headNoteGujarati == (undefined || null) ? '' : headNoteGujrati) + result + String(data.resultHindi == (undefined || null) ? '' : resultHindi) + String(data.resultGujarati == (undefined || null) ? '' : resultGujrati) + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
              //       } else if (userData?.isMarathi == true && userData?.isGujarati == true) {
              //         html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + String(data.importantPointsMarathi == (undefined || null) ? '' : importantPointsMarathi) + String(data.importantPointsGujarati == (undefined || null) ? '' : importantPointsGujrati) + headNote + String(data.headNoteMarathi == (undefined || null) ? '' : headNoteMarathi) + String(data.headNoteGujarati == (undefined || null) ? '' : headNoteGujrati) + result + String(data.resultMarathi == (undefined || null) ? '' : resultMarathi) + String(data.resultGujarati == (undefined || null) ? '' : resultGujrati) + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
              //       } else if (userData?.isMarathi == true) {
              //         html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + String(data.importantPointsMarathi == (undefined || null) ? '' : importantPointsMarathi) + headNote + String(data.headNoteMarathi == (undefined || null) ? '' : headNoteMarathi) + result + String(data.resultMarathi == (undefined || null) ? '' : resultMarathi) + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
              //       } else if (userData?.isGujarati == true) {
              //         html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + String(data.importantPointsGujarati == (undefined || null) ? '' : importantPointsGujrati) + headNote + String(data.headNoteGujarati == (undefined || null) ? '' : headNoteGujrati) + result + String(data.resultGujarati == (undefined || null) ? '' : resultGujrati) + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
              //       } else if (userData?.isHindi == true) {
              //         html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + String(data.importantPointsHindi == (undefined || null) ? '' : importantPointsHindi) + headNote + String(data.headNoteHindi == (undefined || null) ? '' : headNoteHindi) + result + String(data.resultHindi == (undefined || null) ? '' : resultHindi) + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
              //       } else {
              //         html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + headNote + result + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
              //       }
              //       res.send({
              //         message: 'Created HTML',
              //         result: data,
              //         html: html,
              //       })
              //     }
              //   });
            }
          })
        }
      })
    }
  }

  getFullJudgementInHtml = function (req: any, res: any) {
    var token = req.headers.token;
    var lg = req.query.lg;
    var withName = req.query.withName;
    var onlyEnglish = req.query.onlyEnglish;
    if (token) {
      jwt.verify(token, "your_jwt_secret", (err: any, user: any) => {
        if (err) {
          return res.send({
            message: "unauthorized access",
            responseCode: 700,
            status: 200,
            error: err,
          });
        } else {
          Users.findOne({ _id: mongoose.Types.ObjectId(user._id) }, (error: any, userData?: any) => {
            if (error) {
              return res.send({
                message: "unauthorized access",
                responseCode: 700,
                status: 200,
                error: err,
              });
            } else {
              DataEntry.findOne({ _id: mongoose.Types.ObjectId(req.query.postId) }, (error: any, data: any) => {
                if (error) {
                  return res.send({
                    message: "unauthorized access",
                    responseCode: 700,
                    status: 200,
                    error: err,
                  });
                } else {
                  var name = '';
                  var city = ''
                  // <script>setCookie("googtrans", "/en/hi"); function testLoad(){document.getElementById("test").innerHTML = document.cookie;} function setCookie(key, value, expiry){ var expires = new Date();expires.setTime(expires.getTime() + (expiry * 24 * 60 * 60 * 1000));document.cookie = key + "=" + value + ";expires=" + expires.toUTCString();}function googleTranslateElementInit() {new google.translate.TranslateElement({pageLanguage: "en"},"google_translate_element");}</script><script src="http://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script><div id="google_translate_element"></div>'+
                  var dldId = '<head><meta name="viewport" content="width=device-width"><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script><script>$(document).ready(function() {$("*").each(function(i, obj) {var type = $(obj).css("margin-left").slice(-2);var px = parseInt($(obj).css("margin-left"));if (px > 0){var newPX = px / 2;$(obj).css("margin-left", newPX +type);}var px = parseInt($(obj).css("margin-right"));if (px > 0) {var newPX = px / 2;$(obj).css("margin-right", newPX +type);}});}); </script><style>iframe{display:none;}p{/*margin-top:0px;margin-bottom:0px;*/overflow-y: hidden;}ol{margin:0px;padding-inline-start: 20px!important;}body{padding: 0px 8px;}table {display: block;overflow-x: auto;}</style><script>setCookie("googtrans", "/en/' + lg + '"); function testLoad(){document.getElementById("test").innerHTML = document.cookie;} function setCookie(key, value, expiry){ var expires = new Date();expires.setTime(expires.getTime() + (expiry * 24 * 60 * 60 * 1000));document.cookie = key + "=" + value + ";expires=" + expires.toUTCString();}</script></head><body></body><div style="display:none" id="google_translate_element"></div><script>function googleTranslateElementInit() {new google.translate.TranslateElement({pageLanguage: "en"},"google_translate_element");}</script><script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>' + '<p style="margin-left:-1px; margin-bottom: 10px; text-align:center"><span style="font-size:14px"><strong>' + data.dldId + '</strong></span></p>';
                  if (withName == 'true') {
                    name = user.fullName;
                    city = user.city;
                    dldId = '<head><meta name="viewport" content="width=device-width"><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script><script>$(document).ready(function() {$("*").each(function(i, obj) {var type = $(obj).css("margin-left").slice(-2);var px = parseInt($(obj).css("margin-left"));if (px > 0){var newPX = px / 2;$(obj).css("margin-left", newPX +type);}var px = parseInt($(obj).css("margin-right"));if (px > 0) {var newPX = px / 2;$(obj).css("margin-right", newPX +type);}});}); </script><style>iframe{display:none;}p{/*margin-top:0px;margin-bottom:0px;*/overflow-y: hidden;}ol{margin:0px;padding-inline-start: 20px!important;}body{padding: 0px 8px;}table {display: block;overflow-x: auto;}</style><script>setCookie("googtrans", "/en/' + lg + '"); function testLoad(){document.getElementById("test").innerHTML = document.cookie;} function setCookie(key, value, expiry){ var expires = new Date();expires.setTime(expires.getTime() + (expiry * 24 * 60 * 60 * 1000));document.cookie = key + "=" + value + ";expires=" + expires.toUTCString();}</script></head><body></body><div style="display:none" id="google_translate_element"></div><script>function googleTranslateElementInit() {new google.translate.TranslateElement({pageLanguage: "en"},"google_translate_element");}</script><script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>' + '<p>DAILY LAW DIGEST POWERED BY TAXPERTS SYSTEM PVT LTD</p><p>This Product is Licensed to : ' + name + ' , ' + city + '</p><p style="margin-left:-1px; margin-bottom: 10px; text-align:center"><span style="font-size:14px"><strong>' + data.dldId + '</strong></span></p>';
                  }
                  var importantPoints = '<tbr/><tbr/><p style="margin-left:-1px;text-align:justify"><span id="test" style="font-size:14px"><strong>Important Point:&nbsp;&nbsp;</strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#00B200">' + data.importantPoints + '</span></span></span></p><tbr/>';
                  var importantPointsHindi = '<p style="margin-left:-1px;text-align:justify"><span style="font-size:14px"><strong>महत्वपूर्ण बिंदु:&nbsp;&nbsp;</strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#00B200">' + data.importantPointsHindi + '</span></span></span></p><tbr/>';
                  var importantPointsMarathi = '<p style="margin-left:-1px;text-align:justify"><span style="font-size:14px"><strong>महत्त्वाचा मुद्दा:&nbsp;&nbsp;</strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#00B200">' + data.importantPointsMarathi + '</span></span></span></p><tbr/>';
                  var importantPointsGujrati = '<p style="margin-left:-1px;text-align:justify"><span style="font-size:14px"><strong>મહત્વનો મુદ્દો:&nbsp;&nbsp;</strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#00B200">' + data.importantPointsGujarati + '</span></span></span></p><tbr/>';
                  var decidedDate = '<p style="margin-left:-1px; text-align:center"><span style="font-size:14px"><strong>Decided on: ' + dateformat(new Date(data.decidedDate), "dd-mm-yyyy") + '</strong></span></p>';
                  var soi;
                  if (data.courtType == 0) {
                    soi = '<p style="margin-left:-1px; text-align:center"><span style="font-size:18px"><strong>SUPREME COURT OF INDIA</strong></span></p>';
                  } else if (data.courtType == 1) {
                    if (data.courtSubType == 0) {
                      soi = '<p style="margin-left:-1px; text-align:center"><span style="font-size:18px"><strong>BOMBAY HIGH COURT</strong></span></p>';
                    } else if (data.courtSubType == 1) {
                      soi = '<p style="margin-left:-1px; text-align:center"><span style="font-size:18px"><strong>BOMBAY HIGH COURT <br>(Nagpur Bench)</strong></span></p>';
                    } else if (data.courtSubType == 2) {
                      soi = '<p style="margin-left:-1px; text-align:center"><span style="font-size:18px"><strong>BOMBAY HIGH COURT <br>(Aurangabad Bench)</strong></span></p>';
                    } else if (data.courtSubType == 3) {
                      soi = '<p style="margin-left:-1px; text-align:center"><span style="font-size:18px"><strong>BOMBAY HIGH COURT <br>(Goa Bench)</strong></span></p>';
                    }
                  }
                  var vs = '<p style="margin-left:-1px; margin-bottom: 10px; margin-top: 10px; text-align:center"><span style="font-size:14px"><strong>VS</strong></span></p>';
                  var appelentName = '<p style="margin-left:-1px; text-align:center"><span style="font-size:14px"><strong>' + data.appelentName + '-APPELLANT</strong></span></p>';
                  var judges = '<p style="margin-left:-1px; text-align:center"><span style="font-size:14px"><strong>( Before : ' + data.judges + ', JJ. )</strong></span></p>';
                  var headNote = '<p style="margin-left:-1px;text-align:justify"><span style="font-size:14px"><strong><span style="color:#00000a; font-family:Times New Roman, sans-serif">Head Point:&nbsp;</span></strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#ff0000">' + data.headNote + '</span></span></span></p><tbr/>';
                  var headNoteHindi = '<p style="margin-left:-1px;text-align:justify"><span style="font-size:14px"><strong><span style="color:#00000a; font-family:Times New Roman, sans-serif">शीर्ष टिप्पणी:&nbsp;</span></strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#ff0000">' + data.headNoteHindi + '</span></span></span></p><tbr/>';
                  var headNoteMarathi = '<p style="margin-left:-1px;text-align:justify"><span style="font-size:14px"><strong><span style="color:#00000a; font-family:Times New Roman, sans-serif">मुख्य टीप:&nbsp;</span></strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#ff0000">' + data.headNoteMarathi + '</span></span></span></p><tbr/>';
                  var headNoteGujrati = '<p style="margin-left:-1px;text-align:justify"><span style="font-size:14px"><strong><span style="color:#00000a; font-family:Times New Roman, sans-serif">મુખ્ય નોંધ:&nbsp;</span></strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#ff0000">' + data.headNoteGujarati + '</span></span></span></p><tbr/>';
                  var respondentName = '<p style="margin-left:-1px; text-align:center"><span style="font-size:14px"><strong>' + data.respondentName + '-RESPONDENT</strong></span></p>';
                  var result = '<p style="margin-left:-1px;text-align:justify"><strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">Result:&nbsp;</span></span></span></strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">' + data.result + '</span></span></span></p>';
                  var resultHindi = '<tbr/><p style="margin-left:-1px;text-align:justify"><strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">परिणाम:&nbsp;</span></span></span></strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">' + data.resultHindi + '</span></span></span></p>';
                  var resultMarathi = '<tbr/><p style="margin-left:-1px;text-align:justify"><strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">परिणाम:&nbsp;</span></span></span></strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">' + data.resultMarathi + '</span></span></span></p>';
                  var resultGujrati = '<tbr/><p style="margin-left:-1px;text-align:justify"><strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">પરિણામ:&nbsp;</span></span></span></strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">' + data.resultGujarati + '</span></span></span></p>';
                  var caseRefferedText = '<tbr/><p><span style="font-size:14px"><strong>Case Reffered:&nbsp;</strong></span></p>';
                  var caseReffered = '<ul>';
                  var caseRefListTag = '<li><span style="font-size:14px;text-align:justify"></span></li>'
                  if (data.caseReffered == null || data.caseReffered == null) {
                    caseReffered = '';
                  } else {
                    var caseRef = data.caseReffered.split('\n\n');
                    var caseRefLenght = Buffer.from(caseRef).length;
                    for (var i = 0; i < caseRefLenght; i++) {
                      caseReffered = caseReffered + '<li><span style="font-size:14px">' + String(caseRef[i]) + '</span></li>';
                    }
                  }
                  var postType = '<p style="text-align:center"><span style="font-size:14px"><strong>' + data.postType + '</strong></span></p>';
                  var type = '<p style="text-align:center"><span style="font-size:16px"><strong>' + data.type + '</strong></span></p>';
                  var fullJudgement = data.fullJudgement;
                  var html;
                  if (userData?.isHindi == true && userData?.isMarathi == true && userData?.isGujarati == true && onlyEnglish) {
                    html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + String(data.importantPointsHindi == (undefined || null) ? '' : importantPointsHindi) + String(data.importantPointsMarathi == (undefined || null) ? '' : importantPointsMarathi) + String(data.importantPointsGujarati == (undefined || null) ? '' : importantPointsGujrati) + headNote + String(data.headNoteHindi == (undefined || null) ? '' : headNoteHindi) + String(data.headNoteMarathi == (undefined || null) ? '' : headNoteMarathi) + String(data.headNoteGujarati == (undefined || null) ? '' : headNoteGujrati) + result + String(data.resultHindi == (undefined || null) ? '' : resultHindi) + String(data.resultMarathi == (undefined || null) ? '' : resultMarathi) + String(data.resultGujarati == (undefined || null) ? '' : resultGujrati) + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
                  } else if (userData?.isHindi == true && userData?.isMarathi == true && onlyEnglish) {
                    html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + String(data.importantPointsHindi == (undefined || null) ? '' : importantPointsHindi) + String(data.importantPointsMarathi == (undefined || null) ? '' : importantPointsMarathi) + headNote + String(data.headNoteHindi == (undefined || null) ? '' : headNoteHindi) + String(data.headNoteMarathi == (undefined || null) ? '' : headNoteMarathi) + result + String(data.resultHindi == (undefined || null) ? '' : resultHindi) + String(data.resultMarathi == (undefined || null) ? '' : resultMarathi) + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
                  } else if (userData?.isHindi == true && userData?.isGujarati == true && onlyEnglish) {
                    html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + String(data.importantPointsHindi == (undefined || null) ? '' : importantPointsHindi) + String(data.importantPointsGujarati == (undefined || null) ? '' : importantPointsGujrati) + headNote + String(data.headNoteHindi == (undefined || null) ? '' : headNoteHindi) + String(data.headNoteGujarati == (undefined || null) ? '' : headNoteGujrati) + result + String(data.resultHindi == (undefined || null) ? '' : resultHindi) + String(data.resultGujarati == (undefined || null) ? '' : resultGujrati) + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
                  } else if (userData?.isMarathi == true && userData?.isGujarati == true && onlyEnglish) {
                    html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + String(data.importantPointsMarathi == (undefined || null) ? '' : importantPointsMarathi) + String(data.importantPointsGujarati == (undefined || null) ? '' : importantPointsGujrati) + headNote + String(data.headNoteMarathi == (undefined || null) ? '' : headNoteMarathi) + String(data.headNoteGujarati == (undefined || null) ? '' : headNoteGujrati) + result + String(data.resultMarathi == (undefined || null) ? '' : resultMarathi) + String(data.resultGujarati == (undefined || null) ? '' : resultGujrati) + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
                  } else if (userData?.isMarathi == true && onlyEnglish) {
                    html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + String(data.importantPointsMarathi == (undefined || null) ? '' : importantPointsMarathi) + headNote + String(data.headNoteMarathi == (undefined || null) ? '' : headNoteMarathi) + result + String(data.resultMarathi == (undefined || null) ? '' : resultMarathi) + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
                  } else if (userData?.isGujarati == true && onlyEnglish) {
                    html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + String(data.importantPointsGujarati == (undefined || null) ? '' : importantPointsGujrati) + headNote + String(data.headNoteGujarati == (undefined || null) ? '' : headNoteGujrati) + result + String(data.resultGujarati == (undefined || null) ? '' : resultGujrati) + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
                  } else if (userData?.isHindi == true && onlyEnglish) {
                    html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + String(data.importantPointsHindi == (undefined || null) ? '' : importantPointsHindi) + headNote + String(data.headNoteHindi == (undefined || null) ? '' : headNoteHindi) + result + String(data.resultHindi == (undefined || null) ? '' : resultHindi) + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
                  } else {
                    html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + headNote + result + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
                  }
                  res.write(html);
                  res.end();
                }
              })
            }
          })
        }
      })
    }
  }

  // getFullJudgementInHtml = function (req: any, res: any) {
  //   var token = req.headers.token;
  //   if (token) {
  //     jwt.verify(token, "your_jwt_secret", (err: any, user: any) => {
  //       if (err) {
  //         return res.send({
  //           message: "unauthorized access",
  //           responseCode: 700,
  //           status: 200,
  //           error: err,
  //         });
  //       } else {
  //         Users.findOne({ _id: mongoose.Types.ObjectId(user._id) }, (error: any, userData?: any) => {
  //           if (error) {
  //             return res.send({
  //               message: "unauthorized access",
  //               responseCode: 700,
  //               status: 200,
  //               error: err,
  //             });
  //           } else {
  //             DataEntry.findOne({ _id: mongoose.Types.ObjectId(req.body.postId) }, (error: any, data: any) => {
  //               if (error) {
  //                 return res.send({
  //                   message: "unauthorized access",
  //                   responseCode: 700,
  //                   status: 200,
  //                   error: err,
  //                 });
  //               } else {
  //                 // <script>setCookie("googtrans", "/en/hi"); function testLoad(){document.getElementById("test").innerHTML = document.cookie;} function setCookie(key, value, expiry){ var expires = new Date();expires.setTime(expires.getTime() + (expiry * 24 * 60 * 60 * 1000));document.cookie = key + "=" + value + ";expires=" + expires.toUTCString();}function googleTranslateElementInit() {new google.translate.TranslateElement({pageLanguage: "en"},"google_translate_element");}</script><script src="http://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script><div id="google_translate_element"></div>'+
  //                 var dldId = '<head><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>iframe{display:none;}*{margin-right:0px!important}p{margin-top:0px;margin-bottom:0px;overflow-y: hidden;}ol{margin:0px;}body{padding: 0px 12px;}</style></head><body></body><div id="google_translate_element"></div><script>function googleTranslateElementInit() {new google.translate.TranslateElement({pageLanguage: "en"},"google_translate_element");}</script><script src="http://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>'+'<p style="margin-left:-1px; margin-bottom: 10px; text-align:center"><span style="font-size:14px"><strong>' + data.dldId + '</strong></span></p>';
  //                 var importantPoints = '<tbr/><tbr/><p style="margin-left:-1px;text-align:justify"><span id="test" style="font-size:14px"><strong>Important Point:&nbsp;&nbsp;</strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#00B200">' + data.importantPoints + '</span></span></span></p><tbr/>';
  //                 var importantPointsHindi = '<p style="margin-left:-1px;text-align:justify"><span style="font-size:14px"><strong>महत्वपूर्ण बिंदु:&nbsp;&nbsp;</strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#00B200">' + data.importantPointsHindi + '</span></span></span></p><tbr/>';
  //                 var importantPointsMarathi = '<p style="margin-left:-1px;text-align:justify"><span style="font-size:14px"><strong>महत्त्वाचा मुद्दा:&nbsp;&nbsp;</strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#00B200">' + data.importantPointsMarathi + '</span></span></span></p><tbr/>';
  //                 var importantPointsGujrati = '<p style="margin-left:-1px;text-align:justify"><span style="font-size:14px"><strong>મહત્વનો મુદ્દો:&nbsp;&nbsp;</strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#00B200">' + data.importantPointsGujarati + '</span></span></span></p><tbr/>';
  //                 var decidedDate = '<p style="margin-left:-1px; text-align:center"><span style="font-size:14px"><strong>Decided on: ' + dateformat(new Date(data.decidedDate), "dd-mm-yyyy"); + '</strong></span></p><tbr/>';
  //                 var soi = '<p style="margin-left:-1px; text-align:center"><span style="font-size:18px"><strong>SUPREME COURT OF INDIA</strong></span></p>';
  //                 var vs = '<p style="margin-left:-1px; margin-bottom: 10px; margin-top: 10px; text-align:center"><span style="font-size:14px"><strong>VS</strong></span></p>';
  //                 var appelentName = '<p style="margin-left:-1px; text-align:center"><span style="font-size:14px"><strong>' + data.appelentName + '-APPELLANT</strong></span></p>';
  //                 var judges = '<p style="margin-left:-1px; text-align:center"><span style="font-size:14px"><strong>( Before : ' + data.judges + ', JJ. )</strong></span></p>';
  //                 var headNote = '<p style="margin-left:-1px;text-align:justify"><span style="font-size:14px"><strong><span style="color:#00000a; font-family:Times New Roman, sans-serif">Head Point:&nbsp;</span></strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#ff0000">' + data.headNote + '</span></span></span></p><tbr/>';
  //                 var headNoteHindi = '<p style="margin-left:-1px;text-align:justify"><span style="font-size:14px"><strong><span style="color:#00000a; font-family:Times New Roman, sans-serif">शीर्ष टिप्पणी:&nbsp;</span></strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#ff0000">' + data.headNoteHindi + '</span></span></span></p><tbr/>';
  //                 var headNoteMarathi = '<p style="margin-left:-1px;text-align:justify"><span style="font-size:14px"><strong><span style="color:#00000a; font-family:Times New Roman, sans-serif">मुख्य टीप:&nbsp;</span></strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#ff0000">' + data.headNoteMarathi + '</span></span></span></p><tbr/>';
  //                 var headNoteGujrati = '<p style="margin-left:-1px;text-align:justify"><span style="font-size:14px"><strong><span style="color:#00000a; font-family:Times New Roman, sans-serif">મુખ્ય નોંધ:&nbsp;</span></strong><span style="font-family:Times New Roman,sans-serif"><span style="color:#ff0000">' + data.headNoteGujarati + '</span></span></span></p><tbr/>';
  //                 var respondentName = '<p style="margin-left:-1px; text-align:center"><span style="font-size:14px"><strong>' + data.respondentName + '-RESPONDENT</strong></span></p>';
  //                 var result = '<p style="margin-left:-1px;text-align:justify"><strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">Result:&nbsp;</span></span></span></strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">' + data.result + '</span></span></span></p>';
  //                 var resultHindi = '<tbr/><p style="margin-left:-1px;text-align:justify"><strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">परिणाम:&nbsp;</span></span></span></strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">' + data.resultHindi + '</span></span></span></p>';
  //                 var resultMarathi = '<tbr/><p style="margin-left:-1px;text-align:justify"><strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">परिणाम:&nbsp;</span></span></span></strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">' + data.resultMarathi + '</span></span></span></p>';
  //                 var resultGujrati = '<tbr/><p style="margin-left:-1px;text-align:justify"><strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">પરિણામ:&nbsp;</span></span></span></strong><span style="font-size:14px"><span style="font-family:Times New Roman,sans-serif"><span style="color:#00000a">' + data.resultGujarati + '</span></span></span></p>';
  //                 var caseRefferedText = '<tbr/><p><span style="font-size:14px"><strong>Case Reffered:&nbsp;</strong></span></p>';
  //                 var caseReffered = '<ul>';
  //                 var caseRefListTag = '<li><span style="font-size:14px;text-align:justify"></span></li>'
  //                 if (data.caseReffered == null || data.caseReffered == null) {
  //                   caseReffered = '';
  //                 } else {
  //                   var caseRef = data.caseReffered.split('\n\n');
  //                   var caseRefLenght = Buffer.from(caseRef).length;
  //                   for (var i = 0; i < caseRefLenght; i++) {
  //                     caseReffered = caseReffered + '<li><span style="font-size:14px">' + String(caseRef[i]) + '</span></li>';
  //                   }
  //                 }
  //                 var postType = '<p style="text-align:center"><span style="font-size:14px"><strong>' + data.postType + '</strong></span></p>';
  //                 var type = '<p style="text-align:center"><span style="font-size:16px"><strong>' + data.type + '</strong></span></p>';
  //                 var fullJudgement = data.fullJudgement;
  //                 var html;
  //                 if (userData?.isHindi == true && userData?.isMarathi == true && userData?.isGujarati == true) {
  //                   html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + String(data.importantPointsHindi == (undefined || null) ? '' : importantPointsHindi) + String(data.importantPointsMarathi == (undefined || null) ? '' : importantPointsMarathi) + String(data.importantPointsGujarati == (undefined || null) ? '' : importantPointsGujrati) + headNote + String(data.headNoteHindi == (undefined || null) ? '' : headNoteHindi) + String(data.headNoteMarathi == (undefined || null) ? '' : headNoteMarathi) + String(data.headNoteGujarati == (undefined || null) ? '' : headNoteGujrati) + result + String(data.resultHindi == (undefined || null) ? '' : resultHindi) + String(data.resultMarathi == (undefined || null) ? '' : resultMarathi) + String(data.resultGujarati == (undefined || null) ? '' : resultGujrati) + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
  //                 } else if (userData?.isHindi == true && userData?.isMarathi == true) {
  //                   html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + String(data.importantPointsHindi == (undefined || null) ? '' : importantPointsHindi) + String(data.importantPointsMarathi == (undefined || null) ? '' : importantPointsMarathi) + headNote + String(data.headNoteHindi == (undefined || null) ? '' : headNoteHindi) + String(data.headNoteMarathi == (undefined || null) ? '' : headNoteMarathi) + result + String(data.resultHindi == (undefined || null) ? '' : resultHindi) + String(data.resultMarathi == (undefined || null) ? '' : resultMarathi) + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
  //                 } else if (userData?.isHindi == true && userData?.isGujarati == true) {
  //                   html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + String(data.importantPointsHindi == (undefined || null) ? '' : importantPointsHindi) + String(data.importantPointsGujarati == (undefined || null) ? '' : importantPointsGujrati) + headNote + String(data.headNoteHindi == (undefined || null) ? '' : headNoteHindi) + String(data.headNoteGujarati == (undefined || null) ? '' : headNoteGujrati) + result + String(data.resultHindi == (undefined || null) ? '' : resultHindi) + String(data.resultGujarati == (undefined || null) ? '' : resultGujrati) + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
  //                 } else if (userData?.isMarathi == true && userData?.isGujarati == true) {
  //                   html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + String(data.importantPointsMarathi == (undefined || null) ? '' : importantPointsMarathi) + String(data.importantPointsGujarati == (undefined || null) ? '' : importantPointsGujrati) + headNote + String(data.headNoteMarathi == (undefined || null) ? '' : headNoteMarathi) + String(data.headNoteGujarati == (undefined || null) ? '' : headNoteGujrati) + result + String(data.resultMarathi == (undefined || null) ? '' : resultMarathi) + String(data.resultGujarati == (undefined || null) ? '' : resultGujrati) + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
  //                 } else if (userData?.isMarathi == true) {
  //                   html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + String(data.importantPointsMarathi == (undefined || null) ? '' : importantPointsMarathi) + headNote + String(data.headNoteMarathi == (undefined || null) ? '' : headNoteMarathi) + result + String(data.resultMarathi == (undefined || null) ? '' : resultMarathi) + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
  //                 } else if (userData?.isGujarati == true) {
  //                   html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + String(data.importantPointsGujarati == (undefined || null) ? '' : importantPointsGujrati) + headNote + String(data.headNoteGujarati == (undefined || null) ? '' : headNoteGujrati) + result + String(data.resultGujarati == (undefined || null) ? '' : resultGujrati) + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
  //                 } else if (userData?.isHindi == true) {
  //                   html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + String(data.importantPointsHindi == (undefined || null) ? '' : importantPointsHindi) + headNote + String(data.headNoteHindi == (undefined || null) ? '' : headNoteHindi) + result + String(data.resultHindi == (undefined || null) ? '' : resultHindi) + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
  //                 } else {
  //                   html = dldId + soi + appelentName + vs + respondentName + judges + decidedDate + importantPoints + headNote + result + caseRefferedText + caseReffered + '</ul>' + type + fullJudgement;
  //                 }
  //                 res.send({
  //                   message: 'Created HTML',
  //                   result: data,
  //                   html: html,
  //                 })
  //               }
  //             })
  //           }
  //         })
  //       }
  //     })
  //   }
  // }

  updatePost = function (req: any, res: any, next: any) {
    var token = req.headers.token;
    if (token) {
      jwt.verify(token, "your_jwt_secret", (err: any, user: any) => {
        if (err) {
          return res.send({
            message: "unauthorized access",
            responseCode: 700,
            status: 200,
            error: err,
          });
        } else {
          var data = req.body.data;
          DataEntry.findOne({ _id: mongoose.Types.ObjectId(data.id) }, (error: any, datas: any) => {
            if (error) {
              return res.send({
                message: 'Unauthorized DB Error',
                responseCode: 700,
                status: 200,
                error: error
              });
            } else {
              DataEntry.updateOne({ _id: mongoose.Types.ObjectId(data.id) }, { $set: data }, { upsert: true, new: true, returnOriginal: false }, (error: any, result: any) => {
                if (error) {
                  return res.send({
                    message: 'Unauthorized DB Error',
                    responseCode: 700,
                    status: 200,
                    error: error
                  });
                } else {
                  if (datas.postType == 0 && data.postType == 1) {
                    CountSchema.findOneAndUpdate({ _id: mongoose.Types.ObjectId('5feb02231a69ef7cdad89044') }, { $inc: { totalCivil: -1 } }, { new: true, returnOriginal: false }, (error: any, count: any) => {
                      if (error) {
                        return res.send({
                          message: 'Unauthorized DB Error',
                          responseCode: 700,
                          status: 200,
                          error: error
                        });
                      } else {
                        CountSchema.findOneAndUpdate({ _id: mongoose.Types.ObjectId('5feb02231a69ef7cdad89044') }, { $inc: { totalCriminal: 1 } }, { new: true, returnOriginal: false }, (error: any, count: any) => {
                          if (error) {
                            return res.send({
                              message: 'Unauthorized DB Error',
                              responseCode: 700,
                              status: 200,
                              error: error
                            });
                          } else {
                            return res.send({
                              message: 'Post Updated Successfully',
                              responseCode: 2000,
                              status: 200,
                            });
                          }
                        })
                      }
                    })
                  } else if (datas.type == 1 && result.type == 0) {
                    CountSchema.findOneAndUpdate({ _id: mongoose.Types.ObjectId('5feb02231a69ef7cdad89044') }, { $inc: { totalCriminal: -1 } }, { new: true, returnOriginal: false }, (error: any, count: any) => {
                      if (error) {
                        return res.send({
                          message: 'Unauthorized DB Error',
                          responseCode: 700,
                          status: 200,
                          error: error
                        });
                      } else {
                        CountSchema.findOneAndUpdate({ _id: mongoose.Types.ObjectId('5feb02231a69ef7cdad89044') }, { $inc: { totalCivil: 1 } }, { new: true, returnOriginal: false }, (error: any, count: any) => {
                          if (error) {
                            return res.send({
                              message: 'Unauthorized DB Error',
                              responseCode: 700,
                              status: 200,
                              error: error
                            });
                          } else {
                            return res.send({
                              message: 'Post Updated Successfully',
                              responseCode: 200,
                              status: 200,
                            });
                          }
                        })
                      }
                    })
                  } else {
                    return res.send({
                      message: 'Post Updated Successfully',
                      responseCode: 2000,
                      status: 200,
                    });
                  }
                }
              });
            }
          })
        }
      })
    }
  }

  deletePost = function (req: any, res: any, next: any) {
    var token = req.headers.token;
    if (token) {
      jwt.verify(token, "your_jwt_secret", (err: any, user: any) => {
        if (err) {
          return res.send({
            message: "unauthorized access",
            responseCode: 700,
            status: 200,
            error: err,
          });
        } else {
          var data = req.body.data;
          DataEntry.findOneAndDelete({ _id: mongoose.Types.ObjectId(data) }, (error: any, result: any) => {
            if (error) {
              return res.send({
                message: 'Unauthorized DB Error',
                responseCode: 700,
                status: 200,
                error: error
              });
            } else {
              if (result.postType == 0) {
                CountSchema.findOneAndUpdate({ _id: mongoose.Types.ObjectId('5feb02231a69ef7cdad89044') }, { $inc: { totalCivil: -1 } }, { new: true, returnOriginal: false }, (error: any, countUpdate: any) => {
                  if (error) {
                    return res.send({
                      message: "Unauthorized DB error",
                      responseCode: 700,
                      status: 200,
                      error: error,
                    });
                  } else {
                    return res.send({
                      responseCode: 2000,
                      status: 200,
                      message: 'Successfully Deleted record'
                    });
                  }
                })
              } else {
                CountSchema.findOneAndUpdate({ _id: mongoose.Types.ObjectId('5feb02231a69ef7cdad89044') }, { $inc: { totalCriminal: -1 } }, { new: true, returnOriginal: false }, (error: any, countUpdate: any) => {
                  if (error) {
                    return res.send({
                      message: "Unauthorized DB error",
                      responseCode: 700,
                      status: 200,
                      error: error,
                    });
                  } else {
                    return res.send({
                      responseCode: 2000,
                      status: 200,
                      message: 'Successfully Deleted record'
                    });
                  }
                })
              }
            }
          });
        }
      })
    }
  }

  getData = function (req: any, res: any, next: any) {
    const pageSize = parseInt(req.query.pageSize);
    const pageIndex = parseInt(req.query.pageIndex);
    var token = req.headers.token;
    if (token) {
      jwt.verify(token, "your_jwt_secret", (err: any, user: any) => {
        if (err) {
          return res.send({
            message: "unauthorized access",
            responseCode: 700,
            status: 200,
            error: err,
          });
        } else {
          if (pageIndex > 0) {
            DataEntry.aggregate(
              [
                {
                  $match: {
                    enabled: true
                  }
                },
                {
                  $sort: { pid: -1 },
                },
                { $skip: pageSize * (pageIndex - 1) },
                { $limit: pageSize },
                {
                  $lookup: {
                    from: "bookmarks",
                    as: "bookmark",
                    let: {
                      userObjId: { $toObjectId: "$_id" },
                      pid: "$pid",
                      uid: "$uid",
                    },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $and: [
                              { $eq: ["$pid", "$$userObjId"] },
                              {
                                $eq: [
                                  mongoose.Types.ObjectId(user._id),
                                  "$uid",
                                ],
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              ],
              function (error: any, data: any) {
                if (error) {
                  return res.send({
                    message: "Unauthorized DB Error",
                    responseCode: 700,
                    status: 200,
                    error: error,
                  });
                } else {
                  return res.send({
                    message: "All Data",
                    responseCode: 200,
                    status: 200,
                    result: data,
                  });
                }
              }
            ).collation({ locale: "en_US", numericOrdering: true });
          }
        }
      });
    } else {
      return res.send({
        message: "Page Index should pe greater the 0",
        status: 200,
        responseCode: 600,
      });
    }
  };

  statatics = function (req: any, res: any, next: any) {
    var token = req.headers.token;
    if (token) {
      jwt.verify(token, "your_jwt_secret", (err: any, user: any) => {
        if (err) {
          return res.send({
            message: "unauthorized access",
            responseCode: 700,
            status: 200,
            error: err,
          });
        } else {
          DataEntry.aggregate([
            {
              $group: {
                '_id': 0
              }
            },
            {
              $lookup: {
                from: 'dataentries',
                let: {},
                pipeline: [
                  { "$match": { enabled: true } },
                  {
                    $group: {
                      '_id': 0,
                      'count': { $sum: 1 }
                    }
                  }
                ],
                as: 'datas'
              }
            },
            {
              $lookup: {
                from: 'counts',
                let: {},
                pipeline: [
                  { "$match": { _id: mongoose.Types.ObjectId('5feb02231a69ef7cdad89044') } },
                ],
                as: 'counts'
              }
            },
            {
              $lookup: {
                from: 'users',
                let: {},
                pipeline: [
                  {
                    $group: {
                      '_id': 0,
                      'count': { $sum: 1 }
                    }
                  }
                ],
                as: 'users'
              }
            },
            {
              $lookup: {
                from: 'bookmarks',
                let: {},
                pipeline: [
                  {
                    $group: {
                      '_id': 0,
                      'count': { $sum: 1 }
                    }
                  }
                ],
                as: 'bookmarks'
              }
            },
            {
              $lookup: {
                from: 'plans',
                let: {},
                pipeline: [
                  {
                    $group: {
                      '_id': 0,
                      'count': { $sum: 1 }
                    }
                  }
                ],
                as: 'plans'
              }
            },
            {
              $lookup: {
                from: 'payments',
                let: {},
                pipeline: [
                  {
                    $group: {
                      '_id': 0,
                      'count': { $sum: 1 }
                    }
                  }
                ],
                as: 'payments'
              }
            },
            // {
            //   $unwind: {
            //     path: '$datas',
            //   }
            // },
            // {
            //   $unwind: {
            //     path: '$users',
            //   }
            // },
            // {
            //   $unwind: {
            //     path: '$bookmarks',
            //   }
            // },
            // {
            //   $unwind: {
            //     path: '$counts',
            //   }
            // },
          ], function (error: any, data: any) {
            if (error) {
              return res.send({
                message: 'Unauthorized DB Error',
                responseCode: 700,
                status: 200,
                error: error
              });
            } else {
              var url = `https://2factor.in/API/V1/cf327688-3edc-11eb-83d4-0200cd936042/BAL/SMS`;
              request(url, function (error: any, response: any, body: any) {
                if (!error && response.statusCode == 200) {
                  data['sms'] = JSON.parse(body).Details;
                  return res.send({
                    message: 'All Data',
                    responseCode: 200,
                    status: 200,
                    result: data,
                    counts: {
                      sms: JSON.parse(body).Details
                    }
                  });
                } else {

                }
              })
            }
          });
        }
      })
    }
  }

  async translate(req: any, res: any) {
    var token = req.headers.token;
    if (token) {
      jwt.verify(token, "your_jwt_secret", async (err: any, user: any) => {
        if (err) {
          return res.send({
            message: "unauthorized access",
            responseCode: 700,
            status: 200,
            error: err,
          });
        } else {
          DataEntry.findOne({ _id: mongoose.Types.ObjectId(req.body.postId) }, async (error: any, result: any) => {
            if (err) {
              return res.send({
                message: "unauthorized access",
                responseCode: 700,
                status: 200,
                error: err,
              });
            } else {
              await translate(result.fullJudgement, { to: req.body.to, engine: 'google', key: 'AIzaSyCf66xSBLggv2oWWsrMIfJ878Yir5Gocyo' }).then((result: any) => {
                res.send({
                  content: result,
                  responseCode: 2000,
                  status: 200
                })
              }).catch((err: any) => {
                console.error(err);
                res.send({
                  responseCode: 700,
                  status: 200,
                  error: err
                })
              });
            }
          })

        }
      })
    }
  }

  async priorityUpdate(req: any, res: any) {
    var token = req.headers.token;
    if (token) {
      jwt.verify(token, "your_jwt_secret", async (err: any, user: any) => {
        if (err) {
          return res.send({
            message: "unauthorized access",
            responseCode: 700,
            status: 200,
            error: err,
          });
        } else {
          DataEntry.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.postId) }, { $set: { priority: req.body.priority } }, { new: true, returnOriginal: false }, async (error: any, result: any) => {
            if (err) {
              return res.send({
                message: "unauthorized access",
                responseCode: 700,
                status: 200,
                error: err,
              });
            } else {
              return res.send({
                message: "Priority Updated",
                responseCode: 2000,
                status: 200,
                result: result,
              });
            }
          })
        }
      }
      )
    }
  }
}

export const dataController1 = new Data1Controller();
