"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var doctopus_1 = require("doctopus");
var data_controller_1 = require("../controllers/data.controller");
var data1_controller_1 = require("../controllers/data1.controller");
var DataRoute = /** @class */ (function () {
    function DataRoute() {
    }
    DataRoute.prototype.copyData = function (app) {
        app.post('/v1/data', data_controller_1.dataController.copyData);
    };
    DataRoute.prototype.getData = function (app) {
        app.get('/v1/data', data_controller_1.dataController.getData);
    };
    DataRoute.prototype.getDataByStatus = function (app) {
        app.get('/v1/databystatus', data_controller_1.dataController.getDataByStatus);
    };
    DataRoute.prototype.getAllData = function (app) {
        app.post('/v1/alldata', data_controller_1.dataController.getAllData);
    };
    DataRoute.prototype.getAllOfflineData = function (app) {
        app.post('/v1/allofflinedata', data_controller_1.dataController.getAllOfflineData);
    };
    DataRoute.prototype.searchData = function (app) {
        app.get('/v1/search', data_controller_1.dataController.searchData);
    };
    DataRoute.prototype.searchDataByStatus = function (app) {
        app.get('/v1/searchbystatus', data_controller_1.dataController.searchDataByStatus);
    };
    DataRoute.prototype.statatics = function (app) {
        app.get('/v1/statatics', data_controller_1.dataController.statatics);
    };
    DataRoute.prototype.updatePost = function (app) {
        app.put('/v1/updatePost', data_controller_1.dataController.updatePost);
    };
    DataRoute.prototype.addPost = function (app) {
        app.post('/v1/addPost', data1_controller_1.dataController1.addPost);
    };
    DataRoute.prototype.getAllPost = function (app) {
        app.get('/v1/getAllPost', data1_controller_1.dataController1.getAllPost);
    };
    DataRoute.prototype.getPostById = function (app) {
        app.post('/v1/getPostById', data1_controller_1.dataController1.getPostById);
    };
    DataRoute.prototype.addPlan = function (app) {
        app.post('/v1/addplan', data_controller_1.dataController.addPlan);
    };
    DataRoute.prototype.updatePlan = function (app) {
        app.put('/v1/updateplan', data_controller_1.dataController.updatePlan);
    };
    DataRoute.prototype.deletePost = function (app) {
        app.post('/v1/deletePost', data_controller_1.dataController.deletePost);
    };
    DataRoute.prototype.syncPost = function (app) {
        app.post('/v1/syncPost', data_controller_1.dataController.dailyData);
    };
    DataRoute.prototype.postLive = function (app) {
        app.post('/v1/golive', data_controller_1.dataController.postLive);
    };
    DataRoute.prototype.getAllPlans = function (app) {
        app.post('/v1/getallplans', data_controller_1.dataController.getAllPlans);
    };
    DataRoute.prototype.getAllpayments = function (app) {
        app.post('/v1/allpayments', data_controller_1.dataController.getAllpayments);
    };
    DataRoute.prototype.checkForLogin = function (app) {
        app.post('/v1/checkForLogin', data_controller_1.dataController.checkForLogin);
    };
    DataRoute.prototype.login = function (app) {
        app.post('/v1/login', data_controller_1.dataController.login);
    };
    DataRoute.prototype.updateLastId = function (app) {
        app.put('/v1/update-lastid', data_controller_1.dataController.updateLastId);
    };
    DataRoute.prototype.uploadAndConvertExcel = function (app) {
        app.post('/v1/excel-upload', data_controller_1.dataController.uploadAndConvertExcel);
    };
    DataRoute.prototype.dataRoute = function (app) {
        this.copyData(app);
        this.getData(app);
        this.searchData(app);
        this.getAllData(app);
        this.statatics(app);
        this.updatePost(app);
        this.addPost(app);
        this.deletePost(app);
        this.syncPost(app);
        this.getAllOfflineData(app);
        this.postLive(app);
        this.addPlan(app);
        this.updatePlan(app);
        this.getAllPlans(app);
        this.checkForLogin(app);
        this.login(app);
        this.getAllpayments(app);
        this.getDataByStatus(app);
        this.updateLastId(app);
        this.searchDataByStatus(app);
        this.uploadAndConvertExcel(app);
        this.getAllPost(app);
        this.getPostById(app);
    };
    __decorate([
        doctopus_1.post,
        doctopus_1.route('/v1/data'),
        doctopus_1.summary('fetch Data from other server'),
        doctopus_1.param({
            "in": 'param',
            name: 'startNumber'
        }),
        doctopus_1.response({
            description: 'will copy from one domain to other',
            schema: doctopus_1.Doc.inlineObj({
                message: doctopus_1.Doc.string(),
                status: doctopus_1.Doc.number(),
                error: doctopus_1.Doc.string(),
                responseCode: doctopus_1.Doc.number()
            })
        })
    ], DataRoute.prototype, "copyData");
    DataRoute = __decorate([
        doctopus_1.group('User')
    ], DataRoute);
    return DataRoute;
}());
exports["default"] = DataRoute;
