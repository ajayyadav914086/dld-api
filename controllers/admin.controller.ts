const jwt = require("jsonwebtoken");
var mongoose = require("mongoose");
var Admin = require("../models/admin.model");

export default class AdminController {
  createAdminRoles = function (req: any, res: any) {
    var schema = {
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
          message: "Role Created",
          responseCode: 20000,
          status: 200,
          result: result,
          token: token,
        });
      }
    });
  };

  adminLogin = function (req: any, res: any) {};
}

export const adminController = new AdminController();
