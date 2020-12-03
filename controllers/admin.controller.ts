const jwt = require("jsonwebtoken");
var mongoose = require("mongoose");
var Admin = require("../models/admin.model");

export default class AdminController {
  createAdmin = function (req: any, res: any) {
    var schema = {
      enabled: req.body.enabled,
      fullName: req.body.fullName,
      email: req.body.email,
      mobile: req.body.mobile,
      gender: req.body.gender,
      password: req.body.password,
      role: req.body.role,
    };
    Admin.create(schema, (error: any, result: any) => {
      if (error) {
        return res.send({
          message: "Unauthorized DB Error",
          responseCode: 700,
          status: 200,
          error: error,
        });
      } else {
        var token = jwt.sign(JSON.stringify(result), "your_jwt_secret");
        return res.send({
          message: "Admin Created",
          responseCode: 2000,
          status: 200,
          result: result,
          token: token,
        });
      }
    });
  };

  adminLogin = function (req: any, res: any) {
    var email = req.body.email;
    var password = req.body.password;
    Admin.findOne(
      { email: email, password: password },
      (error: any, result: any) => {
        if (error) {
          return res.send({
            message: "Unauthorized DB Error",
            responseCode: 700,
            status: 200,
            error: error,
          });
        } else {
          if (result != null) {
            var token = jwt.sign(JSON.stringify(result), "your_jwt_secret");
            return res.send({
              message: "Admin Logged In",
              responseCode: 2000,
              status: 200,
              result: result,
              token: token,
            });
          } else {
            return res.send({
              message: "Admin Dont exist",
              responseCode: 500,
              status: 200,
            });
          }
        }
      }
    );
  };

  getAdmin = function (req: any, res: any) {
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
          Admin.find().exec((err: any, result: any) => {
            if (err) {
              res.send({
                message: "Unauthorized DB error",
                responseCode: 100,
                status: 200,
                error: err,
              });
            } else {
              res.send({
                message: "Admins",
                responseCode: 300,
                status: 200,
                result: result,
              });
            }
          });
        }
      });
    }
  };
}

export const adminController = new AdminController();
