const jwt = require("jsonwebtoken");
var mongoose = require("mongoose");
var Admin = require("../models/admin.model");
import * as bcrypt from "bcryptjs";
var User = require("../models/user.model");
var Suggestion = require("../models/suggestion.model");
var generator = require("generate-password");
var Shortcuts = require("../models/shortcuts.model");
export default class AdminController {
  createAdmin = function (req: any, res: any) {
    if (req.body.agentId == null || req.body.agentId == undefined) {
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
    } else {
      Admin.findOne({ agentId: req.body.agentId }, (error: any, agent: any) => {
        if (error) {
          return res.send({
            message: "Unauthorized DB Error",
            responseCode: 700,
            status: 200,
            error: error,
          });
        } else {
          if (agent == null) {
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
          } else {
            return res.send({
              message: "Agent ID already exists",
              responseCode: 800,
              status: 200,
            });
          }
        }
      });
    }
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
            { _id: mongoose.Types.ObjectId(req.body.id) },
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
                  responseCode: 2000,
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

  updateAdminEnable = function (req: any, res: any) {
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
            { _id: mongoose.Types.ObjectId(req.body.id) },
            {
              enabled: req.body.enabled,
            },
            {
              returnOriginal: false,
              new: true,
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
                  responseCode: 2000,
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
    Admin.findOne({ email: email }, (error: any, result: any) => {
      if (error) {
        return res.send({
          message: "Unauthorized DB Error",
          responseCode: 700,
          status: 200,
          error: error,
        });
      } else {
        if (result != null) {
          bcrypt.compare(
            req.body.password,
            result.password,
            (error: any, hash: any) => {
              if (error) {
                return res.send({
                  message: "Unauthorized DB Error",
                  responseCode: 700,
                  status: 200,
                  error: error,
                });
              } else {
                if (hash === true) {
                  var token = jwt.sign(
                    JSON.stringify(result),
                    "your_jwt_secret"
                  );
                  return res.send({
                    message: "Admin Logged In",
                    responseCode: 2000,
                    status: 200,
                    result: result,
                    token: token,
                  });
                } else {
                  res.send({
                    error: "Incorrect Phone Number or password.",
                    responseCode: 4000,
                    status: "200",
                  });
                }
              }
            }
          );
        } else {
          return res.send({
            message: "Admin Dont exist",
            responseCode: 500,
            status: 200,
          });
        }
      }
    });
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
                  if (result.enabled == false) {
                    res.send({
                      message: "Agent Id Disabled",
                      responseCode: 900,
                      statusCode: 200,
                    });
                  } else {
                    res.send({
                      message: "Discount Value",
                      responseCode: 2000,
                      statusCode: 200,
                      discount: result.discountValue,
                    });
                  }
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

  addSuggestion = function (req: any, res: any) {
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
          const schema = {
            suggestion: req.body.suggestion,
          };
          Suggestion.findOne(schema, (error: any, suggestion: any) => {
            if (error) {
              return res.send({
                message: "unauthorized access",
                responseCode: 700,
                status: 200,
                error: err,
              });
            } else {
              if (suggestion != null) {
                return res.send({
                  message: "Already Exists",
                  responseCode: 800,
                  status: 200,
                });
              } else {
                Suggestion.create(schema, (error: any, result: any) => {
                  if (error) {
                    return res.send({
                      message: "unauthorized access",
                      responseCode: 700,
                      status: 200,
                      error: err,
                    });
                  } else {
                    return res.send({
                      message: "Suggestion Added",
                      responseCode: 2000,
                      status: 200,
                      result: result,
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

  getSuggestion = function (req: any, res: any) {
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
          var suggestion = req.query.suggestion;
          Suggestion.find(
            { suggestion: { $regex: suggestion, $options: "i" } },
            (error: any, result: any) => {
              if (error) {
                return res.send({
                  message: "unauthorized access",
                  responseCode: 700,
                  status: 200,
                  error: err,
                });
              } else {
                return res.send({
                  message: "Suggestions",
                  responseCode: 2000,
                  status: 200,
                  result: result,
                });
              }
            }
          );
        }
      });
    }
  };

  getAllSuggestion = function (req: any, res: any) {
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
          Suggestion.find({}, (error: any, result: any) => {
            if (error) {
              return res.send({
                message: "unauthorized access",
                responseCode: 700,
                status: 200,
                error: err,
              });
            } else {
              return res.send({
                message: "Suggestions",
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

  deleteSuggestion = function (req: any, res: any) {
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
          const schema = {
            _id: mongoose.Types.ObjectId(req.query.suggestionId),
          };
          Suggestion.remove(schema, (error: any, result: any) => {
            if (error) {
              return res.send({
                message: "unauthorized access",
                responseCode: 700,
                status: 200,
                error: err,
              });
            } else {
              return res.send({
                message: "Suggestion Deleted",
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

  addShortcuts = function (req: any, res: any) {
    var schema = {
      word: req.body.word,
      shortcut: req.body.shortcut,
    };
    Shortcuts.create(schema, (err: any, result: any) => {
      if (err) {
        return res.send({
          message: "Unauthorized DB Error",
          responseCode: 700,
          status: 200,
          error: err,
        });
      } else {
        return res.send({
          message: "success",
          responseCode: 700,
          status: 200,
          result: result,
        });
      }
    });
  };
}

export const adminController = new AdminController();
