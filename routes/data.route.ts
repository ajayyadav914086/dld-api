import { group, get, route, param, response, Doc, post, summary, SchemaBuilder, put, del } from 'doctopus';
import { Express } from 'express';
import { dataController } from '../controllers/data.controller';


@group('User')
export default class DataRoute {
    @post
    @route('/v1/data')
    @summary('fetch Data from other server')
    @param({
        in: 'param',
        name: 'startNumber',
    })
    @response({
        description: 'will copy from one domain to other',
        schema: Doc.inlineObj({
            message: Doc.string(),
            status: Doc.number(),
            error: Doc.string(),
            responseCode: Doc.number(),
        })
    })
    copyData(app: Express) {
        app.post('/v1/data', dataController.copyData);
    }
    getData(app: Express) {
        app.get('/v1/data', dataController.getData);
    }

    getDataByStatus(app: Express) {
        app.get('/v1/databystatus', dataController.getDataByStatus);
    }

    getAllData(app: Express) {
        app.post('/v1/alldata', dataController.getAllData);
    }
    getAllOfflineData(app: Express) {
        app.post('/v1/allofflinedata', dataController.getAllOfflineData);
    }
    searchData(app: Express) {
        app.get('/v1/search', dataController.searchData);
    }

    searchDataByStatus(app: Express) {
        app.get('/v1/searchbystatus', dataController.searchDataByStatus);
    }

    statatics(app: Express) {
        app.get('/v1/statatics', dataController.statatics);
    }
    updatePost(app: Express) {
        app.put('/v1/updatePost', dataController.updatePost);
    }

    addPost(app: Express) {
        app.post('/v1/addPost', dataController.addPost);
    }

    addPlan(app: Express) {
        app.post('/v1/addplan', dataController.addPlan);
    }
    updatePlan(app: Express) {
        app.put('/v1/updateplan', dataController.updatePlan);
    }
    deletePost(app: Express) {
        app.post('/v1/deletePost', dataController.deletePost);
    }

    syncPost(app: Express) {
        app.post('/v1/syncPost', dataController.dailyData);
    }

    postLive(app: Express) {
        app.post('/v1/golive', dataController.postLive);
    }

    getAllPlans(app: Express) {
        app.post('/v1/getallplans', dataController.getAllPlans);
    }

    getAllpayments(app: Express) {
        app.post('/v1/allpayments', dataController.getAllpayments);
    }

    checkForLogin(app: Express) {
        app.post('/v1/checkForLogin', dataController.checkForLogin);
    }
    login(app: Express) {
        app.post('/v1/login', dataController.login);
    }

    updateLastId(app: Express) {
        app.put('/v1/update-lastid', dataController.updateLastId)
    }

    uploadAndConvertExcel(app: Express) {
        app.post('/v1/excel-upload', dataController.uploadAndConvertExcel);
    }

    dataRoute(app: Express) {
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
    }
}