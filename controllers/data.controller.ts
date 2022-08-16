const Data = require('../models/data.model');
const Plan = require('../models/plan.model');
const Payment = require('../models/payment.model');

const CountSchema = require('../models/count.model');
import request = require('request');
import FirebaseNotification from '../config/firebase.config';
import Mail from '../config/mail.config';
import upload, { uploadExcel } from '../config/multer.config';
const readXlsxFile = require('read-excel-file/node');
var request1 = require('request-promise');
var HTMLParser = require('node-html-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
var mongoose = require('mongoose');
const download = require('download');
var moment = require('moment');
var dateformat = require("dateformat");
export default class DataController {
    checkForLogin = function (req: any, res: any, next: any) {
        var id = '96625';
        var postdata: request.CoreOptions = {
            headers: {
                'cookie': 'PHPSESSID=gv0aovb6drr0fc3vsjobnaurbc; _ga=GA1.2.1546259822.1591834528; _gid=GA1.2.1275462200.1591834528; __gads=ID=d44cdf65391b1eab:T=1591834527:S=ALNI_MZcYBmLuT2hVQOe6J_z38S8RXwtVg; G_ENABLED_IDPS=google; _gat_gtag_UA_133555870_2=1'
            },
        };
        request.get('https://findauction.in/auction/sbi/office_in_indore-' + id, postdata, function (error, response, body) {
            console.error('error:', error);
            console.log('statusCode:', response && response.statusCode);
            console.log('id:', id);
            const result: any = {};
            const root = HTMLParser.parse(body, {
                script: false,
                style: false,
                pre: false,
                comment: false
            });
            const allProp = root.querySelectorAll('.account-btn');
            console.log(allProp);
        });
    }
    login = function (req: any, res: any, next: any) {
        var id = '96625';
        var postdata: request.CoreOptions = {
            formData: {
                'email': 'btaniya21@gmail.com',
                'password': 'abc@123',
            },
            json: true
        };

        request.post('https://findauction.in/ajax.php?type=login', postdata, function (error, response, body) {
            console.error('error:', error);
            console.log('statusCode:', response && response.statusCode);
            console.log('id:', id);
            const result: any = {};
            const root = HTMLParser.parse(body, {
                script: false,
                style: false,
                pre: false,
                comment: false
            });
            const allProp = root.querySelectorAll('.account-btn');
            const token = response.headers["set-cookie"] ? response.headers["set-cookie"][0].split(';')[0].split('=')[1] : '';
            console.log(token);
        });
    }
    copyData = function (req: any, res: any, next: any) {
        var id = req.body.id;
        request('https://findauction.in/auction/sbi/office_in_indore-' + id, function (error, response, body) {
            console.error('error:', error);
            console.log('statusCode:', response && response.statusCode);
            console.log('id:', id);
            const result: any = {};
            const root = HTMLParser.parse(body, {
                script: false,
                style: false,
                pre: false,
                comment: false
            });
            const allProp = root.querySelectorAll('.property-title');
            const allDetails = root.querySelectorAll('dl');
            allDetails.forEach((details: any) => {
                var key = details.querySelectorAll('dt');
                var value = details.querySelectorAll('dd');
                if (key[0].innerHTML.trim() !== "") {
                    if (dataController.camelize(key[0].innerHTML.trim()) !== "auctionFile") {
                        if (dataController.camelize(key[0].innerHTML.trim()) !== "eAuctionWebsite") {
                            if (dataController.camelize(key[0].innerHTML.trim()).replace(/-/ig, '').replace(/&/ig, '').replace('(Rs.)', '') === "priceReserve") {
                                result['price'] = parseFloat(value[0].innerHTML.trim().replace(/(<([^>]+)>)/ig, '').replace(/,/ig, ''));
                            }
                            if (dataController.camelize(key[0].innerHTML.trim()).replace(/-/ig, '').replace(/&/ig, '').replace('(Rs.)', '') === "auctionStartDateTime") {
                                result['auctionStartDateTimeDate'] = new Date(value[0].innerHTML.trim().replace(/(<([^>]+)>)/ig, '').replace(/,/ig, '')).toISOString();
                            }
                            result[dataController.camelize(key[0].innerHTML.trim()).replace(/-/ig, '').replace(/&/ig, '').replace('(Rs.)', '').replace('(EMDSubmission)', '')] = value[0].innerHTML.trim().replace(/(<([^>]+)>)/ig, '').trim();
                        } else {
                            var alink = value[0].querySelectorAll('a');
                            if (alink.length != 0) {
                                alink.forEach((atag: any) => {
                                    result[dataController.camelize(key[0].innerHTML.trim()).replace(/-/ig, '').replace(/&/ig, '').replace('(Rs.)', '').replace('(EMDSubmission)', '')] = atag['attributes']['href'];
                                })

                            } else {
                                result[dataController.camelize(key[0].innerHTML.trim()).replace(/-/ig, '').replace(/&/ig, '').replace('(Rs.)', '').replace('(EMDSubmission)', '')] = "";
                            }
                        }
                    } else {
                        var files: any[] = [];
                        var allATags = value[0].querySelectorAll('a');
                        var i = 0;
                        if (allATags.length != 0) {
                            allATags.forEach((atag: any) => {
                                download('https:' + atag['attributes']['href']).then((data: any) => {
                                    files.push('/dist/' + 'bauktion_' + id + '_' + i + '.' + DataController.file_get_ext(atag['attributes']['href']));
                                    result[dataController.camelize(key[0].innerHTML.trim())] = files;
                                    fs.writeFileSync('public/dist/' + 'bauktion_' + id + '_' + i + '.' + DataController.file_get_ext(atag['attributes']['href']), data);
                                    i++;
                                    if (allATags.length == i) {
                                        result['pid'] = id;
                                        Data.create(result, function (error: any, user: any) {
                                            if (error) {
                                                return res.send({
                                                    message: 'Unauthorized DB Error',
                                                    responseCode: 700,
                                                    status: 200,
                                                    error: error
                                                });
                                            } else {
                                                return res.send({
                                                    message: 'All fields required',
                                                    responseCode: 600,
                                                    status: 200,
                                                    result: result
                                                });
                                            }
                                        });
                                    }
                                });
                            });
                        } else {
                            result[dataController.camelize(key[0].innerHTML.trim())] = files;
                            result['pid'] = id;
                            Data.create(result, function (error: any, user: any) {
                                if (error) {
                                    return res.send({
                                        message: 'Unauthorized DB Error',
                                        responseCode: 700,
                                        status: 200,
                                        error: error
                                    });
                                } else {
                                    return res.send({
                                        message: 'All fields required',
                                        responseCode: 600,
                                        status: 200,
                                        result: result
                                    });
                                }
                            });
                        }

                    }
                }

            });
        });
    }

    dailyData = function (req: any, res: any) {
        CountSchema.findOne({ _id: mongoose.Types.ObjectId('5e8f760e1c9d44000094bb09') }, function (error: any, result: any) {
            if (error) {
                return res.send({
                    message: 'Unauthorized DB Error',
                    responseCode: 700,
                    status: 200,
                    error: error
                });
            } else {
                if (result.sync) {
                    return res.send({
                        message: 'Process Already Running',
                        responseCode: 300,
                        status: 200,
                    });
                } else {
                    DataController.dailyInternalData()
                    res.send({
                        message: 'Process Started',
                        responseCode: 200,
                        status: 200,
                    });
                }
            }
        });
    }

    static async dailyInternalData() {

        var isEnd = false;
        var total = 0;
        var lastId = 0;
        var posts = 0;
        var isNewAdded = false;
        var maxLimit = 0;
        var atoken = '';

        var postdata: request.CoreOptions = {
            formData: {
                'email': 'btaniya21@gmail.com',
                'password': 'abc@123',
            },
            json: true
        };

        request.post('https://findauction.in/ajax.php?type=login', postdata, function (error, response, body) {
            const root = HTMLParser.parse(body, {
                script: false,
                style: false,
                pre: false,
                comment: false
            });
            atoken = response.headers["set-cookie"] ? response.headers["set-cookie"][0].split(';')[0].split('=')[1] : '';
            CountSchema.findOneAndUpdate({ _id: mongoose.Types.ObjectId('5e8f760e1c9d44000094bb09') }, { $set: { 'sync': true } }, { new: true }, async function (error: any, result: any) {
                if (error) {

                } else {
                    var id = result.lastId;
                    var posts = result.posts;
                    while (!isEnd) {
                        id++;
                        maxLimit++;
                        var postdata: request.CoreOptions = {
                            headers: {
                                'cookie': 'PHPSESSID=' + atoken + '; _ga=GA1.2.1546259822.1591834528; _gid=GA1.2.1275462200.1591834528; __gads=ID=d44cdf65391b1eab:T=1591834527:S=ALNI_MZcYBmLuT2hVQOe6J_z38S8RXwtVg; G_ENABLED_IDPS=google; _gat_gtag_UA_133555870_2=1'
                            },
                        };
                        await request1.get('https://findauction.in/auction/sbi/office_in_indore-' + id, postdata, function (error: any, response: any, body: any) {
                            console.error('error:', error);
                            console.log('statusCode:', response && response.statusCode);
                            console.log('id:', id);
                            if ((response && response.statusCode && response.statusCode == 200 && !body.includes('404-image.png'))) {
                                total++;
                                lastId = id;
                                isNewAdded = true;
                                var mid = id;
                                const result: any = {};
                                const root = HTMLParser.parse(body, {
                                    script: false,
                                    style: false,
                                    pre: false,
                                    comment: false
                                });
                                const allProp = root.querySelectorAll('.property-title');
                                const allDetails = root.querySelectorAll('dl');
                                allDetails.forEach((details: any) => {
                                    var key = details.querySelectorAll('dt');
                                    var value = details.querySelectorAll('dd');
                                    if (key[0].innerHTML.trim() !== "") {
                                        if (dataController.camelize(key[0].innerHTML.trim()) !== "auctionFile") {
                                            if (dataController.camelize(key[0].innerHTML.trim()) !== "eAuctionWebsite") {
                                                if (dataController.camelize(key[0].innerHTML.trim()).replace(/-/ig, '').replace(/&/ig, '').replace('(Rs.)', '') === "priceReserve") {
                                                    result['price'] = parseFloat(value[0].innerHTML.trim().replace(/(<([^>]+)>)/ig, '').replace(/,/ig, ''));
                                                }
                                                if (dataController.camelize(key[0].innerHTML.trim()).replace(/-/ig, '').replace(/&/ig, '').replace('(Rs.)', '') === "auctionStartDateTime") {
                                                    result['auctionStartDateTimeDate'] = new Date(value[0].innerHTML.trim().replace(/(<([^>]+)>)/ig, '').replace(/,/ig, '').replace(' Add To Calendar', '')).toISOString();
                                                }
                                                result[dataController.camelize(key[0].innerHTML.trim()).replace(/-/ig, '').replace(/&/ig, '').replace('(Rs.)', '').replace('(EMDSubmission)', '')] = value[0].innerHTML.trim().replace(/(<([^>]+)>)/ig, '').trim();
                                            } else {
                                                var alink = value[0].querySelectorAll('a');
                                                if (alink.length != 0) {
                                                    alink.forEach((atag: any) => {
                                                        result[dataController.camelize(key[0].innerHTML.trim()).replace(/-/ig, '').replace(/&/ig, '').replace('(Rs.)', '').replace('(EMDSubmission)', '')] = atag['attributes']['href'];
                                                    })

                                                } else {
                                                    result[dataController.camelize(key[0].innerHTML.trim()).replace(/-/ig, '').replace(/&/ig, '').replace('(Rs.)', '').replace('(EMDSubmission)', '')] = "";
                                                }
                                            }
                                        } else {
                                            var files: any[] = [];
                                            var allATags = value[0].querySelectorAll('a');
                                            var i = 0;
                                            if (allATags.length != 0) {
                                                allATags.forEach((atag: any) => {
                                                    download('https:' + atag['attributes']['href']).then((data: any) => {
                                                        files.push('/dist/' + 'bauktion_' + mid + '_' + i + '.' + DataController.file_get_ext(atag['attributes']['href']));
                                                        result[dataController.camelize(key[0].innerHTML.trim())] = files;
                                                        fs.writeFileSync('public/dist/' + 'bauktion_' + mid + '_' + i + '.' + DataController.file_get_ext(atag['attributes']['href']), data);
                                                        i++;
                                                        if (allATags.length == i) {
                                                            result['pid'] = mid;
                                                            Data.create(result, function (error: any, user: any) {
                                                                if (error) {
                                                                    // return res.send({
                                                                    //     message: 'Unauthorized DB Error',
                                                                    //     responseCode: 700,
                                                                    //     status: 200,
                                                                    //     error: error
                                                                    // });
                                                                } else {
                                                                    // return res.send({
                                                                    //     message: 'All fields required',
                                                                    //     responseCode: 600,
                                                                    //     status: 200,
                                                                    //     result: result
                                                                    // });
                                                                }
                                                            });
                                                        }
                                                    });
                                                });
                                            } else {
                                                result[dataController.camelize(key[0].innerHTML.trim())] = files;
                                                result['pid'] = mid;
                                                Data.create(result, function (error: any, user: any) {
                                                    if (error) {
                                                        // return res.send({
                                                        //     message: 'Unauthorized DB Error',
                                                        //     responseCode: 700,
                                                        //     status: 200,
                                                        //     error: error
                                                        // });
                                                    } else {
                                                        // return res.send({
                                                        //     message: 'All fields required',
                                                        //     responseCode: 600,
                                                        //     status: 200,
                                                        //     result: result
                                                        // });
                                                    }
                                                });
                                            }

                                        }
                                    }

                                });
                            } else {
                                if (isNewAdded) {
                                    CountSchema.findOneAndUpdate({ _id: mongoose.Types.ObjectId('5e8f760e1c9d44000094bb09') }, { 'lastId': lastId, 'total': total, 'posts': posts + total, 'sync': false }, { new: true }, (err: any, user: any) => {
                                        Mail.adminMail('admin@bauktion.com', 'Sync Complete | Bauktion', 'Hi Admin,<br/>Action sync is complete with following details:<br/>New Added: ' + total + '<br/>' + 'Total: ' + (posts + total)).then(() => {
                                            console.log('mail send');
                                        });
                                    });
                                } else {
                                    CountSchema.findOneAndUpdate({ _id: mongoose.Types.ObjectId('5e8f760e1c9d44000094bb09') }, { $set: { 'sync': false } }, { new: true }, (err: any, user: any) => {
                                        Mail.adminMail('  n@bauktion.com', 'Sync Complete | Bauktion', 'Hi Admin,<br/>Action sync is complete with following details:<br/>New Added: ' + total + '<br/>' + 'Total: ' + (posts + total)).then(() => {
                                            console.log('mail send');
                                        });
                                    });
                                }
                                isEnd = true;
                            }
                        });
                    }
                }
            });
        });
    }

    searchData = function (req: any, res: any, next: any) {
        const pageSize = parseInt(req.query.pageSize);
        const pageIndex = parseInt(req.query.pageIndex);
        var token = req.headers.token;
        var location = new RegExp(req.query.location, 'i');
        var bankName = new RegExp(req.query.bankName, 'i');
        var values = req.query.propertyType.split(',');
        var propertyType: RegExp[] = [];
        values.forEach((value: any) => {
            propertyType.push(new RegExp(value, 'i'))
        });

        var min = parseInt(req.query.min);
        var max = parseInt(req.query.max);

        // var startDate = moment(new Date(req.query.startDate)).format('YYYY-MM-DD[T00:00:00.000Z]');
        // var endDate = moment(new Date(req.query.endDate)).format('YYYY-MM-DD[T00:00:00.000Z]');



        // var startDate = new Date()
        // var endDate = new Date(req.query.endDate);
        // endDate.setDate(endDate.getDate() + 1)

        var dateRange = {};
        var priceCondition = {};
        if (max !== -1) {
            priceCondition = {
                $and: [
                    { price: { $gte: min } },
                    { price: { $lte: max } }
                ],
            }
        } else {
            priceCondition = { price: { $gte: min } };
        }
        if (req.query.startDate !== '' && req.query.endDate !== '') {
            var startDate = new Date(req.query.startDate);
            var endDate = new Date(req.query.endDate);
            if (startDate && endDate) {
                dateRange = { auctionStartDateTimeDate: { $gte: startDate, $lt: endDate } };
            }
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
                    if (pageIndex > 0) {
                        Data.aggregate([
                            {
                                $match: {
                                    $and: [
                                        {
                                            enabled: true
                                        },
                                        {
                                            $or: [
                                                { location: location },
                                                { city: location }
                                            ],

                                        },
                                        {
                                            bankName: bankName,
                                        },
                                        {
                                            propertyType: { $in: propertyType },
                                        },
                                        priceCondition,
                                        dateRange,
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
                                $sort: { pid: -1 }
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
                                        status: 200,
                                        result: data

                                    });

                                }
                            }).collation({ locale: "en_US", numericOrdering: true });
                    }
                }
            })
        }

        else {
            return res.send({
                message: "Page Index should pe greater the 0",
                status: 200,
                responseCode: 600
            })
        }
    }

    searchDataByStatus = function (req: any, res: any, next: any) {
        const pageSize = parseInt(req.query.pageSize);
        const pageIndex = parseInt(req.query.pageIndex);
        var token = req.headers.token;
        const active = req.query.active;
        var location = new RegExp(req.query.location, 'i');
        var bankName = new RegExp(req.query.bankName, 'i');
        var values = req.query.propertyType.split(',');
        var propertyType: RegExp[] = [];
        values.forEach((value: any) => {
            propertyType.push(new RegExp(value, 'i'))
        });

        var min = parseInt(req.query.min);
        var max = parseInt(req.query.max);

        // var startDate = moment(new Date(req.query.startDate)).format('YYYY-MM-DD[T00:00:00.000Z]');
        // var endDate = moment(new Date(req.query.endDate)).format('YYYY-MM-DD[T00:00:00.000Z]');



        // var startDate = new Date()
        // var endDate = new Date(req.query.endDate);
        // endDate.setDate(endDate.getDate() + 1)

        var dateRange = {};
        var priceCondition = {};
        if (max !== -1) {
            priceCondition = {
                $and: [
                    { price: { $gte: min } },
                    { price: { $lte: max } }
                ],
            }
        } else {
            priceCondition = { price: { $gte: min } };
        }
        if (req.query.startDate !== '' && req.query.endDate !== '') {
            var startDate = new Date(req.query.startDate);
            var endDate = new Date(req.query.endDate);
            if (startDate && endDate) {
                dateRange = { auctionStartDateTimeDate: { $gte: startDate, $lt: endDate } };
            }
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
                    if (pageIndex > 0 && active == 'true') {
                        Data.aggregate([
                            {
                                $match: {
                                    $and: [
                                        {
                                            enabled: true
                                        },
                                        {
                                            auctionStartDateTimeDate: {
                                                $gte: new Date()
                                            }
                                        },
                                        {
                                            $or: [
                                                { location: location },
                                                { city: location }
                                            ],

                                        },
                                        {
                                            bankName: bankName,
                                        },
                                        {
                                            propertyType: { $in: propertyType },
                                        },
                                        priceCondition,
                                        dateRange,
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
                                $sort: { pid: -1 }
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
                                        status: 200,
                                        result: data

                                    });

                                }
                            }).collation({ locale: "en_US", numericOrdering: true });
                    } else if (pageIndex > 0 && active == 'false') {
                        Data.aggregate([
                            {
                                $match: {
                                    $and: [
                                        {
                                            enabled: true
                                        },
                                        {
                                            auctionStartDateTimeDate: {
                                                $lte: new Date()
                                            }
                                        },
                                        {
                                            $or: [
                                                { location: location },
                                                { city: location }
                                            ],

                                        },
                                        {
                                            bankName: bankName,
                                        },
                                        {
                                            propertyType: { $in: propertyType },
                                        },
                                        priceCondition,
                                        dateRange,
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
                                $sort: { pid: -1 }
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
                                        status: 200,
                                        result: data

                                    });

                                }
                            }).collation({ locale: "en_US", numericOrdering: true });
                    }
                }
            })
        }

        else {
            return res.send({
                message: "Page Index should pe greater the 0",
                status: 200,
                responseCode: 600
            })
        }
    }
    getData = function (req: any, res: any, next: any) {
        const pageSize = parseInt(req.query.pageSize);
        const pageIndex = parseInt(req.query.pageIndex);
        var token = req.headers.token;
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
                    if (pageIndex > 0) {
                        Data.aggregate([
                            {
                                $match: { enabled: true }
                            },
                            {
                                $sort: { pid: -1 }
                            },
                            { $skip: pageSize * (pageIndex - 1) },
                            { $limit: pageSize },
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
                        ], function (error: any, data: any) {
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
                    }
                }
            })
        }

        else {
            return res.send({
                message: "Page Index should pe greater the 0",
                status: 200,
                responseCode: 600
            })
        }
    }

    getDataByStatus = function (req: any, res: any, next: any) {
        const pageSize = parseInt(req.query.pageSize);
        const pageIndex = parseInt(req.query.pageIndex);
        const active = req.query.active;
        var token = req.headers.token;
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
                    if (pageIndex > 0 && active == 'true') {
                        Data.aggregate([
                            {
                                $match: {
                                    $and: [
                                        {
                                            enabled: true
                                        },
                                        {
                                            auctionStartDateTimeDate: {
                                                $gte: new Date()
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                $sort: { pid: -1 }
                            },
                            { $skip: pageSize * (pageIndex - 1) },
                            { $limit: pageSize },
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
                            }
                        ], function (error: any, data: any) {
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
                    } else if (pageIndex > 0 && active == 'false') {
                        Data.aggregate([
                            {
                                $match: {
                                    $and: [
                                        {
                                            enabled: true
                                        },
                                        {
                                            auctionStartDateTimeDate: {
                                                $lte: new Date()
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                $sort: { pid: -1 }
                            },
                            { $skip: pageSize * (pageIndex - 1) },
                            { $limit: pageSize },
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
                        ], function (error: any, data: any) {
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
                    }
                }
            })
        }

        else {
            return res.send({
                message: "Page Index should pe greater the 0",
                status: 200,
                responseCode: 600
            })
        }
    }

    statatics = function (req: any, res: any, next: any) {
        Data.aggregate([
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
                    from: 'mails',
                    let: {},
                    pipeline: [
                        {
                            $group: {
                                '_id': 0,
                                'count': { $sum: 1 }
                            }
                        }
                    ],
                    as: 'mails'
                }
            },
            {
                $lookup: {
                    from: 'dataentries',
                    let: {},
                    pipeline: [
                        { "$match": { enabled: false } },
                        {
                            $group: {
                                '_id': 0,
                                'count': { $sum: 1 }
                            }
                        }
                    ],
                    as: 'offline'
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
            {
                $unwind: {
                    path: '$dataentries',
                }
            },
            {
                $unwind: {
                    path: '$users',
                }
            },
            {
                $unwind: {
                    path: '$bookmarks',
                }
            },
            {
                $unwind: {
                    path: '$mails',
                }
            },

        ], function (error: any, data: any) {
            if (error) {
                return res.send({
                    message: 'Unauthorized DB Error',
                    responseCode: 700,
                    status: 200,
                    error: error
                });
            } else {
                CountSchema.findOne({ _id: mongoose.Types.ObjectId('5e8f760e1c9d44000094bb09') }, function (error: any, result: any) {
                    if (error) {
                        return res.send({
                            message: 'Unauthorized DB Error',
                            responseCode: 700,
                            status: 200,
                            error: error
                        });
                    } else {
                        var url = `https://2factor.in/API/V1/32b553b3-5359-11ec-b710-0200cd936042/BAL/SMS`;
                        request(url, function (error: any, response: any, body: any) {
                            if (!error && response.statusCode == 200) {
                                data['sms'] = JSON.parse(body).Details;
                                return res.send({
                                    message: 'All Data',
                                    responseCode: 200,
                                    status: 200,
                                    result: data,
                                    counts: {
                                        sync: result.sync,
                                        lastId: result.lastId,
                                        total: result.total,
                                        sms: JSON.parse(body).Details
                                    }
                                });
                            } else {
                         
                            }
                        })
                    }
                });

            }
        });
    }



    addPlan = function (req: any, res: any, next: any) {
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
                    Plan.create(data, function (error: any, post: any) {
                        if (error) {
                            return res.send({
                                message: 'Unauthorized DB Error',
                                responseCode: 700,
                                status: 200,
                                error: error
                            });
                        } else {
                            return res.send({
                                message: 'Added New Record',
                                responseCode: 2000,
                                status: 200,
                                result: post
                            });
                        }
                    });
                }
            })
        }
    }


    updatePlan = function (req: any, res: any, next: any) {
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
                    var plan = req.body.data;
                    Plan.findOneAndUpdate({ _id: mongoose.Types.ObjectId(plan.id) }, plan, { new: true }, (err: any, user: any) => {
                        if (err) {
                            return res.send({
                                message: 'Unauthorized DB Error',
                                responseCode: 700,
                                status: 200,
                                error: err
                            });
                        } else {
                            return res.send({
                                message: 'Plan Updated Successfully',
                                responseCode: 2000,
                                status: 200,
                                result: user,
                            });
                        }
                    });
                }
            })
        }
    }

    getAllpayments = function (req: any, res: any, next: any) {
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
                    if (req.body.status != null || req.body.status != undefined) {
                        if (req.body.status == 0) {
                            Payment.aggregate([
                                {
                                    $match: {
                                        txtId: "FREE"
                                    }
                                },
                                {
                                    $lookup: {
                                        from: 'users',
                                        as: 'user',
                                        localField: "userId",
                                        foreignField: "_id",
                                    },
                                },
                                // { $unwind: "$plan" },
                                { $unwind: "$user" },
                                // { $skip: pageSize * (pageIndex - 1) },
                                // { $limit: pageSize }
                            ]).exec(function (err: any, payments: any) {
                                if (err) {
                                    return res.send({
                                        message: 'unauthorized db error',
                                        responseCode: 800,
                                        status: 200,
                                        error: err
                                    });
                                } else {
                                    return res.send({
                                        message: 'payments',
                                        responseCode: 300,
                                        status: 200,
                                        result: payments
                                    });
                                }
                            })
                        } else {
                            Payment.aggregate([
                                {
                                    $match: {
                                        txtId: {
                                            $ne: "FREE"
                                        }
                                    }
                                },
                                {
                                    $lookup: {
                                        from: 'users',
                                        as: 'user',
                                        localField: "userId",
                                        foreignField: "_id",
                                    },
                                },
                                // { $unwind: "$plan" },
                                { $unwind: "$user" },
                                // { $skip: pageSize * (pageIndex - 1) },
                                // { $limit: pageSize }
                            ]).exec(function (err: any, payments: any) {
                                if (err) {
                                    return res.send({
                                        message: 'unauthorized db error',
                                        responseCode: 800,
                                        status: 200,
                                        error: err
                                    });
                                } else {
                                    return res.send({
                                        message: 'payments',
                                        responseCode: 300,
                                        status: 200,
                                        result: payments
                                    });
                                }
                            })
                        }
                    } else {
                        Payment.aggregate([
                            {
                                $lookup: {
                                    from: 'users',
                                    as: 'user',
                                    localField: "userId",
                                    foreignField: "_id",
                                },
                            },
                            // { $unwind: "$plan" },
                            { $unwind: "$user" },
                            // { $skip: pageSize * (pageIndex - 1) },
                            // { $limit: pageSize }
                        ]).exec(function (err: any, payments: any) {
                            if (err) {
                                return res.send({
                                    message: 'unauthorized db error',
                                    responseCode: 800,
                                    status: 200,
                                    error: err
                                });
                            } else {
                                return res.send({
                                    message: 'payments',
                                    responseCode: 300,
                                    status: 200,
                                    result: payments
                                });
                            }
                        })
                    }
                }
            })
        }
    }

    getAllPlans = function (req: any, res: any, next: any) {
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
                    Plan.find({ courtType: 0 }).exec(function (err: any, plans: any) {
                        if (err) {
                            return res.send({
                                message: 'unauthorized db error',
                                responseCode: 800,
                                status: 200,
                                error: err
                            });
                        } else {
                            return res.send({
                                message: 'plans',
                                responseCode: 300,
                                status: 200,
                                result: plans
                            });
                        }
                    })
                }
            })
        }
    }

    getAllPlansv2 = function (req: any, res: any, next: any) {
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
                    Plan.find().exec(function (err: any, plans: any) {
                        if (err) {
                            return res.send({
                                message: 'unauthorized db error',
                                responseCode: 800,
                                status: 200,
                                error: err
                            });
                        } else {
                            return res.send({
                                message: 'plans',
                                responseCode: 300,
                                status: 200,
                                result: plans
                            });
                        }
                    })
                }
            })
        }
    }

    addPost = function (req: any, res: any, next: any) {
        if (req.body.username == 'bauktion' && req.body.password == "bauktion@2019") {
            var data = req.body.data;
            data['auctionStartDateTimeDate'] = new Date(data['auctionStartDateTime']).toISOString();
            data['price'] = parseFloat(data['priceReserve']);
            Data.create(data, function (error: any, post: any) {
                if (error) {
                    return res.send({
                        message: 'Unauthorized DB Error',
                        responseCode: 700,
                        status: 200,
                        error: error
                    });
                } else {
                    return res.send({
                        message: 'Added New Record',
                        responseCode: 200,
                        status: 200,
                        result: post
                    });
                }
            });
        } else {
            return res.send({
                message: "Invalid Username and Password",
                responseCode: 100,
                status: 200
            })
        }
    }

    updatePost = function (req: any, res: any, next: any) {
        // if (req.body.username == 'bauktion' && req.body.password == "bauktion@2019") {
        var data = req.body.data;
        Data.updateOne({ _id: mongoose.Types.ObjectId(data.id) }, { $set: data }, { upsert: true, new: true }, (error: any, result: any) => {
            if (error) {
                return res.send({
                    message: 'Unauthorized DB Error',
                    responseCode: 700,
                    status: 200,
                    error: error
                });
            } else {
                return res.send({
                    responseCode: 200,
                    status: 200,
                    message: 'Successfully updated record'
                });
            }
        });
        // } else {
        //     return res.send({
        //         message: "Invalid Username and Password",
        //         responseCode: 100,
        //         status: 200
        //     })
        // }
    }

    updateLastId = function (req: any, res: any, next: any) {
        if (req.body.username == 'bauktion' && req.body.password == "bauktion@2019") {
            CountSchema.findOneAndUpdate({ _id: mongoose.Types.ObjectId('5e8f760e1c9d44000094bb09') }, { lastId: req.body.lastId }, { returnOriginal: false }, (error: any, result: any) => {
                if (error) {
                    return res.send({
                        message: "Database Error",
                        status: 200,
                        responseCode: 700
                    })
                } else {
                    return res.send({
                        responseCode: 200,
                        status: 200,
                        message: 'Successfully Updated Last Id',
                        result: result
                    });
                }
            })
        } else {
            return res.send({
                message: "Invalid Username and Password",
                responseCode: 100,
                status: 200
            })
        }
    }

    deletePost = function (req: any, res: any, next: any) {
        // if (req.body.username == 'bauktion' && req.body.password == "bauktion@2019") {
        var data = req.body.data;
        Data.deleteOne({ _id: mongoose.Types.ObjectId(data) }, (error: any, result: any) => {
            if (error) {
                return res.send({
                    message: 'Unauthorized DB Error',
                    responseCode: 700,
                    status: 200,
                    error: error
                });
            } else {
                return res.send({
                    responseCode: 200,
                    status: 200,
                    message: 'Successfully Deleted record'
                });
            }
        });
        // } else {
        //     return res.send({
        //         message: "Invalid Username and Password",
        //         responseCode: 100,
        //         status: 200
        //     })
        // }
    }
    postLive = function (req: any, res: any, next: any) {
        const list = req.body.list;
        Data.update(
            { _id: { $in: list } },
            { $set: { enabled: true } },
            { multi: true }, function (error: any, result: any) {
                if (error) {
                    return res.send({
                        message: "Database Error",
                        status: 200,
                        responseCode: 700
                    })
                } else {
                    var total = list.length;
                    CountSchema.findOneAndUpdate({ _id: mongoose.Types.ObjectId('5e8f760e1c9d44000094bb09') }, { $inc: { 'totalLive': total } }, { new: true }, async function (error: any, result: any) {
                        if (error) {
                            return res.send({
                                message: "Database Error",
                                status: 200,
                                responseCode: 700
                            })
                        } else {
                            FirebaseNotification.sendPushNotificaitonToAllWithTopic({
                                data: {
                                    type: "1",
                                    title: 'Hurray ' + total + ' new auction added to Bauktion app',
                                    body: "Come explore we've got total of " + result.totalLive + " auctions listed for you all over India.",
                                },
                                notification: {
                                    title: 'Hurray ' + total + ' new auction added to Bauktion app',
                                    body: "Come explore we've got total of " + result.totalLive + " auctions listed for you all over India.",
                                    sound: 'default'
                                },

                            }, {
                                priority: 'high',
                            });
                            return res.send({
                                message: "Update Successfully",
                                status: 200,
                                responseCode: 200
                            })
                        }
                    });
                }
            }
        )
    }
    getAllOfflineData = function (req: any, res: any, next: any) {
        if (req.body.username == 'bauktion' && req.body.password == "bauktion@2019") {
            const pageSize = parseInt(req.body.pageSize);
            const pageIndex = parseInt(req.body.pageIndex);
            if (pageIndex > 0) {
                Data.aggregate(
                    [
                        {
                            "$facet": {
                                "totalData": [
                                    { "$match": { enabled: false } },
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
                    // [
                    // {
                    //     $sort: { pid: -1 }
                    // },
                    // { $skip: pageSize * (pageIndex - 1) },
                    // { $limit: pageSize },
                    // {
                    //     $facet: {
                    //         Alldata: [{ $match: {} }],
                    //         total: { $count: 'total' }
                    //     }
                    // }
                    //],
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
                    });
            } else {
                return res.send({
                    message: "Page Index should pe greater the 0",
                    status: 200,
                    responseCode: 600
                })
            }
        } else {
            return res.send({
                message: "Invalid Username and Password",
                responseCode: 100,
                status: 200
            })
        }
    }

    getAllData = function (req: any, res: any, next: any) {
        // if (req.body.username == 'bauktion' && req.body.password == "bauktion@2019") {
        const pageSize = parseInt(req.body.pageSize);
        const pageIndex = parseInt(req.body.pageIndex);
        if (pageIndex > 0) {
            Data.aggregate(
                [
                    {
                        "$facet": {
                            "totalData": [
                                { "$match": { enabled: true } },
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
                // [
                // {
                //     $sort: { pid: -1 }
                // },
                // { $skip: pageSize * (pageIndex - 1) },
                // { $limit: pageSize },
                // {
                //     $facet: {
                //         Alldata: [{ $match: {} }],
                //         total: { $count: 'total' }
                //     }
                // }
                //],
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
        // } else {
        //     return res.send({
        //         message: "Invalid Username and Password",
        //         responseCode: 100,
        //         status: 200
        //     })
        // }
    }
    camelize = function (str: any) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word: any, index: any) {
            return index == 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
    }

    static file_get_ext(filename: String): String {
        return typeof filename != "undefined" ? filename.substring(filename.lastIndexOf(".") + 1, filename.length).toLowerCase() : 'error';
    }

    async uploadAndConvertExcel(req: any, res: any) {
        CountSchema.findOne({ _id: mongoose.Types.ObjectId('5e8f760e1c9d44000094bb09') }, function (error: any, count: any) {
            if (error) {
                return res.send({
                    message: 'Unauthorized DB Error',
                    responseCode: 700,
                    status: 200,
                    error: error
                });
            } else {
                uploadExcel(req, res, (errorMulter: any) => {
                    if (errorMulter) {
                        res.send({
                            message: "Error in multer!",
                            error: errorMulter
                        })
                    } else if (!req.file) {
                        res.send({
                            message: "File not Present!"
                        })
                    } else {
                        var schema = {
                            'Bauktion Ref. no.': {
                                prop: 'pid',
                                type: Number
                            },
                            'Procured from link': {
                                prop: 'link',
                                type: String
                            },
                            'Ref no. of website procured from': {
                                prop: 'refNumberOfWebsite',
                                type: String
                            },
                            // 'Auction type': {
                            //     prop: '',
                            //     type: String
                            // },
                            'Institution': {
                                prop: 'bankName',
                                type: String
                            },
                            'Borrower\'s Name': {
                                prop: 'borrowerName',
                                type: String
                            },
                            'Property Category': {
                                prop: 'propertyType',
                                type: String
                            },
                            'Property Sub Category': {
                                prop: 'subCategory',
                                type: String
                            },
                            'Location': {
                                prop: 'location',
                                type: String
                            },
                            'City': {
                                prop: 'city',
                                type: String
                            },
                            'Reserve Price': {
                                prop: 'priceReserve',
                                type: String
                            },
                            'EMD Amount': {
                                prop: 'emdAmount',
                                type: String
                            },
                            'Bid Increment value': {
                                prop: 'bidIncrementValue',
                                type: String
                            },
                            // 'Date & Time of Inspection of Property': {
                            //     prop: '',
                            //     type: String
                            // },
                            'Cut-off Date and Time Of E-Tender Submission': {
                                prop: 'lastDateOfETenderSubmission',
                                type: Date
                            },
                            'Auction Start Date and Time': {
                                prop: 'auctionStartDateTimeDate',
                                type: Date
                            },
                            // 'Direct Auction link': {
                            //     prop: '',
                            //     type: String
                            // },
                            // 'Contact details for Auction Support': {
                            //     prop: '',
                            //     type: String
                            // },
                            'Attachment 1': {
                                prop: 'attachment1',
                                type: String
                            },
                            'Attachment 2': {
                                prop: 'attachment2',
                                type: String
                            },
                            'Attachment 3': {
                                prop: 'attachment3',
                                type: String
                            },
                            'Attachment 4': {
                                prop: 'attachment4',
                                type: String
                            },
                            'Attachment 5': {
                                prop: 'attachment5',
                                type: String
                            },
                            'Attachment 6': {
                                prop: 'attachment6',
                                type: String
                            },
                            'Attachment 7': {
                                prop: 'attachment7',
                                type: String
                            },
                            'Attachment 8': {
                                prop: 'attachment8',
                                type: String
                            },
                            'Attachment 9': {
                                prop: 'attachment9',
                                type: String
                            }
                        };
                        var id = count.lastId + 1;
                        readXlsxFile(req.file.path, { schema }).then(async (rows: any, errors: any) => {
                            if (errors) throw errors;
                            let arr: any = [];
                            var len = Buffer.from(rows.rows);
                            var rowsExcel = rows.rows;
                            rowsExcel.map((row: any) => {
                                var auctionFile = [];
                                row['pid'] = id;
                                id++;
                                if (row.hasOwnProperty('attachment1')) {
                                    auctionFile.push(row['attachment1']);
                                    delete row['attachment1'];
                                }
                                if (row.hasOwnProperty('attachment2')) {
                                    auctionFile.push(row['attachment2']);
                                    delete row['attachment2'];
                                }
                                if (row.hasOwnProperty('attachment3')) {
                                    auctionFile.push(row['attachment3']);
                                    delete row['attachment3'];
                                }
                                if (row.hasOwnProperty('attachment4')) {
                                    auctionFile.push(row['attachment4']);
                                    delete row['attachment4'];
                                }
                                if (row.hasOwnProperty('attachment5')) {
                                    auctionFile.push(row['attachment5']);
                                    delete row['attachment5'];
                                }
                                if (row.hasOwnProperty('attachment6')) {
                                    auctionFile.push(row['attachment6']);
                                    delete row['attachment6'];
                                }
                                if (row.hasOwnProperty('attachment7')) {
                                    auctionFile.push(row['attachment7']);
                                    delete row['attachment7'];
                                }
                                if (row.hasOwnProperty('attachment8')) {
                                    auctionFile.push(row['attachment8']);
                                    delete row['attachment8'];
                                }
                                if (row.hasOwnProperty('attachment9')) {
                                    auctionFile.push(row['attachment9']);
                                    delete row['attachment9'];
                                }
                                Object.assign(row, { 'auctionFile': [...auctionFile] })
                                Object.assign(row, { 'price': row['priceReserve'] });
                                Object.assign(row, { 'enabled': false });
                                if (row['subCategory'] != null) {
                                    row['propertyType'] = row['propertyType'].concat(" ", row['subCategory']);
                                }
                                if (row['city'] != null) {
                                    row['location'] = row['city'].concat(" ", row['location']);
                                }
                                var date = row['auctionStartDateTimeDate'];
                                if (row['lastDateOfETenderSubmission'] != null) {
                                    var lastDateOfETenderSubmission = row['lastDateOfETenderSubmission'];
                                    Object.assign(row, { 'lastDateOfETenderSubmission': dateformat(lastDateOfETenderSubmission, 'ddd, dd mmm yyyy HH:mm:ss TT', true) })
                                }
                                Object.assign(row, { 'auctionStartDateTime': dateformat(date, 'GMT:ddd, dd mmm yyyy HH:mm:ss TT', true) })
                                arr.push(row);
                            })
                            Data.insertMany(arr, (error: any, result: any) => {
                                if (error) {
                                    return res.send({
                                        message: 'Unauthorized DB Error',
                                        responseCode: 700,
                                        status: 200,
                                        error: error
                                    });
                                } else {
                                    CountSchema.updateOne({ _id: mongoose.Types.ObjectId('5e8f760e1c9d44000094bb09') }, { $set: { lastId: count.lastId + len.length } }, { returnOriginal: false }, (error: any, countUpdate: any) => {
                                        if (error) {
                                            return res.send({
                                                message: 'Unauthorized DB Error',
                                                responseCode: 700,
                                                status: 200,
                                                error: error
                                            });
                                        } else {
                                            res.send({
                                                lenght: len.length,
                                                arr: arr,
                                                result: result,
                                                countUpdate: countUpdate
                                            })
                                        }
                                    })
                                }
                            })
                        })
                    }
                })
            }
        })
    }

    downloadURL(url: any, id: any) {
        var result: any = {};
        var files: any[] = [];
        var i = 0;
        download('https:' + url).then((data: any) => {
            files.push('/dist/' + 'bauktion_' + id + '_' + i + '.' + DataController.file_get_ext(url));
            fs.writeFileSync('public/dist/' + 'bauktion_' + id + '_' + i + '.' + DataController.file_get_ext(url), data);
        });
    }

}
export const dataController = new DataController();
