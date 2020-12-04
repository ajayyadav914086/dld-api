const jwt = require("jsonwebtoken");
var mongoose = require("mongoose");
var Admin = require("../models/admin.model");
var User = require("../models/user.model");
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
      agentId: req.body.agentId,
      discountValue: req.body.discountValue,
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

  updateAdmin = function (req: any, res: any) {
    var token = req.headers.token;
    if (token) {
      jwt.verify(token, "your_jwt_secret", (err: any, admin: any) => {
        if (err) {
          return res.send({
            message: "unauthorized access",
            responseCode: 700,
            status: 200,
            error: err,
          });
        } else {
          Admin.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(admin._id) },
            {
              fullName: req.body.fullName,
              email: req.body.email,
              mobile: req.body.mobile,
              gender: req.body.gender,
              role: req.body.role,
              agentId: req.body.agentId,
              discountValue: req.body.discountValue,
            },
            {
              returnOriginal: false,
            },
            (err: any, admin: any) => {
              if (err) {
                return res.send({
                  message: "Unauthorized DB Error",
                  responseCode: 700,
                  status: 200,
                  error: err,
                });
              } else {
                return res.send({
                  message: "Admin Updated Successfully",
                  responseCode: 200,
                  status: 200,
                  admin: admin,
                });
              }
            }
          );
        }
      });
    }
  };

  updateAdminEnable = function(req: any, res: any){
    var token = req.headers.token;
    if(token){
      jwt.verify(token, 'your_jwt_secret', (err: any, admin: any) => {
        if(err){
          return res.send({
            message: "unauthorized access",
            responseCode: 700,
            status: 200,
            error: err,
          });
        } else {
          Admin.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(req.body.adminId) },
            {
              enabled: req.body.enabled
            },
            {
              returnOriginal: false,
            },
            (err: any, admin: any) => {
              if (err) {
                return res.send({
                  message: "Unauthorized DB Error",
                  responseCode: 700,
                  status: 200,
                  error: err,
                });
              } else {
                return res.send({
                  message: "Admin enabled updated Successfully",
                  responseCode: 200,
                  status: 200,
                  admin: admin,
                });
              }
            }
          );
        }
      })
    }
  }

  deleteAdmin = function (req: any, res: any) {
    var token = req.headers.token;
    if (token) {
      jwt.verify(token, "your_jwt_secret", (err: any, result: any) => {
        if (err) {
          return res.send({
            message: "unauthorized access",
            responseCode: 700,
            status: 200,
            error: err,
          });
        } else {
          Admin.delete(
            { _id: mongoose.Types.ObjectId(req.body.adminId) },
            (err: any, res: any) => {
              if (err) {
                return res.send({
                  message: "Unauthorized DB Error",
                  responseCode: 700,
                  status: 200,
                  error: err,
                });
              } else {
                return res.send({
                  message: "Admin deleted Successfully",
                  responseCode: 200,
                  status: 200,
                  result: res,
                });
              }
            }
          );
        }
      });
    }
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

  getDiscountValue = function (req: any, res: any) {
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
          Admin.findOne(
            { agentId: req.body.agentId },
            (error: any, result: any) => {
              if (error) {
                res.send({
                  message: "Unauthorized DB error",
                  error: error,
                  responseCode: 700,
                });
              } else {
                if (result != null) {
                  res.send({
                    message: "Discount Value",
                    responseCode: 2000,
                    statusCode: 200,
                    discount: result.discountValue,
                  });
                } else {
                  res.send({
                    message: "Agent id not found",
                    responseCode: 800,
                    statusCode: 200,
                  });
                }
              }
            }
          );
        }
      });
    }
  };
}

export const adminController = new AdminController();
