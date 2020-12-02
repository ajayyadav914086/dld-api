const DataEntry = require("../models/dataEntry.model");
const Plan = require("../models/plan.model");
const Payment = require("../models/payment.model");

const CountSchema = require("../models/counts.model");
import { body } from "express-validator/check";
import request = require("request");
import FirebaseNotification from "../config/firebase.config";
import Mail from "../config/mail.config";
import upload, { uploadExcel } from "../config/multer.config";
const readXlsxFile = require("read-excel-file/node");
var request1 = require("request-promise");
var HTMLParser = require("node-html-parser");
const jwt = require("jsonwebtoken");
const fs = require("fs");
var mongoose = require("mongoose");
const download = require("download");
var moment = require("moment");
var dateformat = require("dateformat");

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
            fullJudgement: req.body.fullJudgement,
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
              return res.send({
                message: "Data post added successfully",
                responseCode: 2000,
                status: 200,
                result: result,
              });
            }
          });
        }
      });
    }
  };

  getAllPost = function (req: any, res: any) {
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
          DataEntry.findOne(
            { _id: mongoose.Types.ObjectId(req.body.postId) },
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
                  responseCode: 200,
                  result: result,
                });
              }
            }
          );
        }
      });
    }
  };
}

export const dataController1 = new Data1Controller();
