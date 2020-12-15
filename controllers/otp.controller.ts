const Otp = require('../models/otp.model');
var otpGenerator = require('otp-generator');
var request = require('request');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
import { emailController } from '../controllers/email.controller';

var endpoint = 'https://2factor.in/API/V1/cf327688-3edc-11eb-83d4-0200cd936042/SMS';
export default class OTPController {
    generateOtp = function (token: any, res: any) {
        var otp = otpGenerator.generate(4, { alphabets: false, specialChars: false, upperCase: false });
        var data = jwt.decode(token);
        var message = otp;
        message = encodeURI(message);

        Otp.findOne({ userID: data._id }, (function (error: any, userOtp: any) {
            if (error) {
                return res.send({
                    message: 'Unauthorized DB Error',
                    responseCode: 700,
                    status: 200,
                    error: error
                });
            } else {
                if (userOtp == null) {
                    var otpData = {
                        userID: data._id,
                        otp: otp,
                    }
                    Otp.create(otpData, function (error: any, otp: any) {
                        if (error) {
                            return res.send({
                                message: 'Unauthorized DB Error',
                                responseCode: 700,
                                status: 200,
                                error: error
                            });
                        } else {
                            var url = `${endpoint}/${data.phoneNumber}/${message}/bauktion`;
                            request(url, function (error: any, response: any, body: any) {
                                if (!error && response.statusCode == 200) {
                                    res.send({ token: token, user: data });
                                }
                            })
                        }
                    });
                } else {
                    Otp.findOneAndUpdate({ _id: userOtp._id }, { $set: { otp: otp } }, function (error: any, otp: any) {
                        if (error) {
                            return res.send({
                                message: 'Unauthorized DB Error',
                                responseCode: 700,
                                status: 200,
                                error: error
                            });
                        } else {
                            var url = `${endpoint}/${data.phoneNumber}/${message}/bauktion`;
                            request(url, function (error: any, response: any, body: any) {
                                if (!error && response.statusCode == 200) {
                                    res.send({
                                        message: 'OTP Sent',
                                        responseCode: 800,
                                        token: token, user: data
                                    });
                                }
                            })
                        }
                    })
                }
            }
        }));


    }

    generateOtpViaId(user: any, res: any) {
        var otp = otpGenerator.generate(4, { alphabets: false, specialChars: false, upperCase: false });
        var message = otp;

        Otp.findOne({ userID: user._id }, (function (error: any, userOtp: any) {
            if (error) {
                return res.send({
                    message: 'Unauthorized DB Error',
                    responseCode: 700,
                    status: 200,
                    error: error
                });
            } else {
                console.log(userOtp);
                if (userOtp == null) {
                    var otpData = {
                        userID: user._id,
                        otp: otp,
                        timestamp: new Date()
                    }
                    Otp.create(otpData, function (error: any, otp: any) {
                        if (error) {
                            return res.send({
                                message: 'Unauthorized DB Error',
                                responseCode: 700,
                                status: 200,
                                error: error
                            });
                        } else {
                            var url = `${endpoint}/${user.phoneNumber}/${message}/bauktion`;
                            request(url, function (error: any, response: any, body: any) {
                                if (!error && response.statusCode == 200) {
                                    res.send({
                                        userId: user._id,
                                        message: "OTP SEND SUCCESSFULLY",
                                        responseCode: 2000
                                    });
                                }
                            })
                        }
                    });
                } else {
                    Otp.findOneAndUpdate({ userID: userOtp.userID }, { $set: { otp: otp } }, { new: true, returnOriginal: false }, function (error: any, otp: any) {
                        if (error) {
                            return res.send({
                                message: 'Unauthorized DB Error',
                                responseCode: 700,
                                status: 200,
                                error: error
                            });
                        } else {
                            var url = `${endpoint}/${user.phoneNumber}/${message}/bauktion`;
                            request(url, function (error: any, response: any, body: any) {
                                if (!error && response.statusCode == 200) {
                                    res.send({
                                        userId: user._id,
                                        message: "OTP SEND SUCCESSFULLY",
                                        responseCode: 2000
                                    });
                                }
                            })
                        }
                    })
                }
            }
        }));
    }


    resendOtp = function (req: any, res: any, next: any) {
        var token = req.headers.token;
        var otp = otpGenerator.generate(4, { alphabets: false, specialChars: false, upperCase: false });
        var data = jwt.decode(token);
        var message = otp;
        message = encodeURI(message);

        Otp.findOne({ userID: data._id }, (function (error: any, userOtp: any) {
            if (error) {
                return res.send({
                    message: 'Unauthorized DB Error',
                    responseCode: 700,
                    status: 200,
                    error: error
                });
            } else {
                User.findById(data._id, function (error: any, userdata: any) {
                    if (userOtp.length == 0) {
                        var otpData = {
                            userID: data._id,
                            otp: otp,
                        }
                        Otp.create(otpData, function (error: any, otp: any) {
                            if (error) {
                                return res.send({
                                    message: 'Unauthorized DB Error',
                                    responseCode: 700,
                                    status: 200,
                                    error: error
                                });
                            } else {
                                var url = `${endpoint}/${userdata.phoneNumber}/${message}/bauktion`;
                                request(url, function (error: any, response: any, body: any) {
                                    if (!error && response.statusCode == 200) {
                                        res.send({
                                            userId: data._id,
                                            message: "OTP RESEND SUCCESSFULLY",
                                            responseCode: 2000
                                        });
                                    }
                                })
                            }
                        });
                    } else {
                        Otp.findOneAndUpdate({ userID: userOtp.userID }, { $set: { otp: otp } }, { new: true, returnOriginal: false }, function (error: any, otp: any) {
                            if (error) {
                                return res.send({
                                    message: 'Unauthorized DB Error',
                                    responseCode: 700,
                                    status: 200,
                                    error: error
                                });
                            } else {
                                var url = `${endpoint}/${userdata.phoneNumber}/${message}/bauktion`;
                                request(url, function (error: any, response: any, body: any) {
                                    if (!error && response.statusCode == 200) {
                                        res.send({
                                            userId: data._id,
                                            message: "OTP RESEND SUCCESSFULLY",
                                            responseCode: 2000
                                        });
                                    }
                                })
                            }
                        })
                    }
                });
            }
        }));
    }

    verifyOtp = function (req: any, res: any, next: any) {
        var data = jwt.decode(req.headers.token);
        Otp.find({ userID: data._id }, (function (error: any, userOtp: any) {
            if (error) {
                return res.send({
                    message: 'Unauthorized DB Error',
                    responseCode: 700,
                    status: 200,
                    error: error
                });
            } else {
                if (Number(req.body.otp) === Number(userOtp[0].otp)) {

                    User.update({ _id: data._id }, { $set: { isMobileVerified: true } }, { new: true, returnOriginal: false }, function () {

                        res.status(200).json(
                            {
                                userId: data._id,
                                message: 'Successfully Verified',
                                responseCode: 2000
                            }
                        );
                    });
                } else {
                    res.status(200).json({
                        message: 'invaild otp',
                        responseCode: 1100
                    });
                }
            }
        }));
    }

    generateEmailOtp = function (token: any, res: any) {
        var otp = otpGenerator.generate(4, { alphabets: false, specialChars: false, upperCase: false });
        var data = jwt.decode(token);
        var message = "Your One time password for Bauktion is " + otp + ". Only valid for 20 min.";

        Otp.find({ userID: data._id }, (function (error: any, userOtp: any) {
            if (error) {
                return res.send({
                    message: 'Unauthorized DB Error',
                    responseCode: 700,
                    status: 200,
                    error: error
                });
            } else {
                User.findById(data._id, function (error: any, userdata: any) {
                    if (userOtp.length == 0) {
                        var otpData = {
                            userID: data._id,
                            emailOtp: otp
                        }
                        Otp.create(otpData, function (error: any, otps: any) {
                            if (error) {
                                return res.send({
                                    message: 'Unauthorized DB Error',
                                    responseCode: 700,
                                    status: 200,
                                    error: error
                                });
                            } else {
                                emailController.sendMail(userdata.email, message);
                                return res.send({
                                    message: 'OTP sent to your email',
                                    responseCode: 200,
                                    status: 200,
                                    otp: otp
                                });
                            }
                        });
                    } else {
                        var emailSchema = {
                            emailOtp: otp
                        }
                        Otp.updateOne({ _id: mongoose.Types.ObjectId(userOtp[0]._id) }, emailSchema, function (error: any, otps: any) {
                            if (error) {
                                return res.send({
                                    message: 'Unauthorized DB Error',
                                    responseCode: 700,
                                    status: 200,
                                    error: error
                                });
                            } else {
                                emailController.sendMail(userdata.email, message);
                                return res.send({
                                    message: 'OTP sent to your email updated',
                                    responseCode: 900,
                                    status: 200,
                                    otp: otp,
                                    userId: userdata._id,
                                    email: userdata.email
                                });
                            }
                        })
                    }
                });
            }
        }));
    }


    generateEmailAndMobileOtp = function (token: any, res: any) {
        var otp = otpGenerator.generate(4, { alphabets: false, specialChars: false, upperCase: false });
        var data = jwt.decode(token);
        var message = "Your One time password for Bauktion is " + otp + ". Only valid for 20 min.";
        message = encodeURI(message);

        Otp.find({ userID: data._id }, (function (error: any, userOtp: any) {
            if (error) {
                return res.send({
                    message: 'Unauthorized DB Error',
                    responseCode: 700,
                    status: 200,
                    error: error
                });
            } else {
                User.findById(data._id, function (error: any, userdata: any) {
                    if (userOtp.length == 0) {
                        var otpData = {
                            userID: data._id,
                            otp: otp,

                        }
                        Otp.create(otpData, function (error: any, otp: any) {
                            if (error) {
                                return res.send({
                                    message: 'Unauthorized DB Error',
                                    responseCode: 700,
                                    status: 200,
                                    error: error
                                });
                            } else {
                                var url = 7
                                request(url, function (error: any, response: any, body: any) {
                                    if (!error && response.statusCode == 200) {
                                        res.send({ token: token, user: data });
                                    }
                                })
                            }
                        });
                    } else {
                        Otp.update({ _id: userOtp[0]._id }, { $set: { otp: otp } }, function (error: any, otp: any) {
                            if (error) {
                                return res.send({
                                    message: 'Unauthorized DB Error',
                                    responseCode: 700,
                                    status: 200,
                                    error: error
                                });
                            } else {
                                var url = 'http://isms.staticcodes.io/vendorsms/pushsms.aspx?user=bauktion&password=5WMBHXWL&msisdn=' + userdata.phoneNumber + '&sid=BAUKTN&msg=' + message + '&fl=0&gwid=2';
                                request(url, function (error: any, response: any, body: any) {
                                    if (!error && response.statusCode == 200) {
                                        // res.send({ message: 'OTP Sent', token: token, user: data });


                                        var otp = otpGenerator.generate(4, { alphabets: false, specialChars: false, upperCase: false });
                                        var data = jwt.decode(token);
                                        var message = "Your One time password for Bauktion is " + otp + ". Only valid for 20 min.";



                                        Otp.find({ userID: data._id }, (function (error: any, userOtp: any) {
                                            if (error) {
                                                return res.send({
                                                    message: 'Unauthorized DB Error',
                                                    responseCode: 700,
                                                    status: 200,
                                                    error: error
                                                });
                                            } else {
                                                User.findById(data._id, function (error: any, userdata: any) {



                                                    if (userOtp.length == 0) {
                                                        var otpData = {
                                                            userID: data._id,
                                                            emailOtp: otp
                                                        }
                                                        Otp.create(otpData, function (error: any, otps: any) {
                                                            if (error) {
                                                                return res.send({
                                                                    message: 'Unauthorized DB Error',
                                                                    responseCode: 700,
                                                                    status: 200,
                                                                    error: error
                                                                });
                                                            } else {
                                                                emailController.sendMail(userdata.email, message);
                                                                return res.send({
                                                                    message: 'OTP sent to your email',
                                                                    responseCode: 200,
                                                                    status: 200,
                                                                    otp: otp
                                                                });
                                                            }
                                                        });
                                                    } else {
                                                        var emailSchema = {
                                                            emailOtp: otp
                                                        }
                                                        Otp.updateOne({ _id: mongoose.Types.ObjectId(userOtp[0]._id) }, emailSchema, function (error: any, otps: any) {
                                                            if (error) {
                                                                return res.send({
                                                                    message: 'Unauthorized DB Error',
                                                                    responseCode: 700,
                                                                    status: 200,
                                                                    error: error
                                                                });
                                                            } else {
                                                                emailController.sendMail(userdata.email, message);
                                                                return res.send({
                                                                    message: 'OTP sent to your email and Mobile',
                                                                    responseCode: 700,
                                                                    status: 200,
                                                                    otp: otp
                                                                });
                                                            }
                                                        })
                                                    }
                                                });
                                            }
                                        }));
                                    }


                                })
                            }
                        })
                    }
                });
            }

        }));


    }

    sendEmailOtp = function (req: any, res: any) {
        var token = req.headers.token;
        otpController.generateEmailOtp(token, res);

    }

    verifyEmailOtp = function (req: any, res: any, next: any) {
        var data = jwt.decode(req.headers.token);
        Otp.find({ userID: data._id }, (function (error: any, userOtp: any) {
            if (error) {
                return res.send({
                    message: 'Unauthorized DB Error',
                    responseCode: 700,
                    status: 200,
                    error: error
                });
            } else {
                if (Number(req.body.otp) === Number(userOtp[0].emailOtp)) {
                    User.update({ _id: data._id }, { $set: { isEmailVerified: true } }, function () {
                        res.status(200).json(
                            {
                                message: 'Successfully Verified',
                                responseCode: 2000
                            }
                        );
                    });
                } else {
                    res.status(200).json({
                        message: 'invaild otp',
                        responseCode: 1100
                    });
                }
            }
        }));
    }

    // changeEmail = function (req: any, res: any, next: any) {
    //     var data = jwt.decode(req.headers.token);
    //     User.findOne({ _id: data._id }, (function (error: any, user: any) {
    //         if (error) {
    //             return res.send({
    //                 message: 'Unauthorized DB Error',
    //                 responseCode: 700,
    //                 status: 200,
    //                 error: error
    //             });
    //         } else {
    //             if (req.body.email) {
    //                 User.find({email:req.body.email},(err:any, users:any)=>{
    //                     if(err){
    //                         return res.send({
    //                             message: 'Unauthorised db error',
    //                             responseCode: 500,
    //                             error: err
    //                         })
    //                     }
    //                     else{
    //                  if(users.length==0){
    //                     User.update({ _id: data._id }, { $set: { email: req.body.email, isEmailVerified: false } }, function (err: any) {
    //                         if (err) {
    //                             return res.send({
    //                                 message: 'Unauthorized DB Error',
    //                                 responseCode: 700,
    //                                 status: 200,
    //                                 error: error
    //                             });
    //                         } else {
    //                             otpController.generateEmailOtp(req.headers.token, res);


    //                         }

    //                     });
    //                  }
    //                  else{
    //                      return res.send({
    //                          message:'Email id already exists',
    //                          responseCode:300,
    //                          status:200,

    //                      })
    //                  }
    //                     }
    //                 })

    //             } else {
    //                 res.status(200).json({
    //                     message: 'email required',
    //                     responseCode: 1100
    //                 });
    //             }
    //         }
    //     }));
    // }
    // otpToBoth = function(token:any, res:any){
    //     var otpnum = otpGenerator.generate(4, { alphabets: false, specialChars: false, upperCase: false });
    //     var data = jwt.decode(token);
    //     var message = "Your One time password for Bauktion is " + otpnum + ". Only valid for 20 min.";
    //     var mobileMessage = encodeURI(message);

    //     Otp.find({ userID: data._id }, (function (error: any, userOtp: any) {
    //         if (error) {
    //             return res.send({
    //                 message: 'Unauthorized DB Error',
    //                 responseCode: 700,
    //                 status: 200,
    //                 error: error
    //             });
    //         } else {
    //             User.findById(data._id, function (error: any, userdata: any) {
    //             if (userOtp.length == 0) {

    //                 var otpData = {
    //                     userID: data._id,
    //                     otp: otpnum,

    //                 }
    //                 Otp.create(otpData, function (error: any, otp: any) {
    //                     if (error) {
    //                         return res.send({
    //                             message: 'Unauthorized DB Error',
    //                             responseCode: 700,
    //                             status: 200,
    //                             error: error
    //                         });
    //                     } else {
    //                         var url = 'http://isms.staticcodes.io/vendorsms/pushsms.aspx?user=bauktion&password=5WMBHXWL&msisdn=' + userdata.phoneNumber + '&sid=BAUKTN&msg=' + message + '&fl=0&gwid=2';
    //                         request(url, function (error: any, response: any, body: any) {
    //                             if (!error && response.statusCode == 200) {
    //                                 res.send({ token: token, user: data });
    //                             }
    //                         })
    //                     }
    //                 });
    //             } else {
    //                 Otp.update({ _id: userOtp[0]._id }, { $set: { otp: otpnum } }, function (error: any, otp: any) {
    //                     if (error) {
    //                         return res.send({
    //                             message: 'Unauthorized DB Error',
    //                             responseCode: 700,
    //                             status: 200,
    //                             error: error
    //                         });
    //                     } else {
    //                         var url = 'http://isms.staticcodes.io/vendorsms/pushsms.aspx?user=bauktion&password=5WMBHXWL&msisdn=' + userdata.phoneNumber + '&sid=BAUKTN&msg=' + message + '&fl=0&gwid=2';
    //                         request(url, function (error: any, response: any, body: any) {
    //                             if (!error && response.statusCode == 200) {
    //                                 // res.send({ message: 'OTP Sent', token: token, user: data });


    //                                     // var otp = otpGenerator.generate(5, { alphabets: false, specialChars: false, upperCase: false });
    //                                     // var data = jwt.decode(token);
    //                                     var message = "Your One time password for Bauktion is " + otpnum + ". Only valid for 20 min.";



    //                                     Otp.find({ userID: data._id }, (function (error: any, userOtp: any) {
    //                                         if (error) {
    //                                             return res.send({
    //                                                 message: 'Unauthorized DB Error',
    //                                                 responseCode: 700,
    //                                                 status: 200,
    //                                                 error: error
    //                                             });
    //                                         } else {
    //                                             User.findById(data._id, function (error: any, userdata: any) {
    //                                                 if (userOtp.length == 0) {
    //                                                     var otpData = {
    //                                                         userID: data._id,
    //                                                         emailOtp: otpnum
    //                                                     }
    //                                                     Otp.create(otpData, function (error: any, otps: any) {
    //                                                         if (error) {
    //                                                             return res.send({
    //                                                                 message: 'Unauthorized DB Error',
    //                                                                 responseCode: 700,
    //                                                                 status: 200,
    //                                                                 error: error
    //                                                             });
    //                                                         } else {
    //                                                             emailController.sendMail(userdata.email, message);
    //                                                             return res.send({
    //                                                                 message: 'OTP sent to your email',
    //                                                                 responseCode: 200,
    //                                                                 status: 200,
    //                                                                 otp:otp
    //                                                             });
    //                                                         }
    //                                                     });
    //                                                 } else {
    //                                                     var emailSchema = {
    //                                                         emailOtp: otpnum
    //                                                     }
    //                                                     console.log('emailOtp: '+otpnum);
    //                                                     Otp.updateOne({ _id: mongoose.Types.ObjectId(userOtp[0]._id) }, emailSchema, function (error: any, otps: any) {
    //                                                         if (error) {
    //                                                             return res.send({
    //                                                                 message: 'Unauthorized DB Error 1',
    //                                                                 responseCode: 700,
    //                                                                 status: 200,
    //                                                                 error: error
    //                                                             });
    //                                                         } else {
    //                                                             emailController.sendMail(userdata.email, message);
    //                                                             return res.send({
    //                                                                 message: 'OTP sent to your email and Mobile',
    //                                                                 responseCode: 700,
    //                                                                 status: 200,
    //                                                                 userId: userdata._id,
    //                                                                 phoneNumber: userdata.phoneNumber,
    //                                                                 email: userdata.email,
    //                                                                 otp: otpnum
    //                                                             });
    //                                                         }
    //                                                     })
    //                                                 }
    //                                             });
    //                                         }
    //                                     }));
    //                                 }


    //                         })
    //                     }
    //                 })
    //             }
    //         });
    //     }
    //     }));
    // }

}





export const otpController = new OTPController();