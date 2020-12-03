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
    Admin.findOne({ email: email, password: password }, (error: any, result: any) => {
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
            status: 200
          });
        }
      }
    })
  };
}

export const adminController = new AdminController();
