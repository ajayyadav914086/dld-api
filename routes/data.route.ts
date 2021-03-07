import { group, get, route, param, response, Doc, post, summary, SchemaBuilder, put, del } from 'doctopus';
import { Express } from 'express';
import { dataController } from '../controllers/data.controller';
import { dataController1 } from '../controllers/data1.controller';


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
        app.get('/v1/data', dataController1.getData);
    }

    getAllData(app: Express) {
        app.post('/v1/alldata', dataController1.getAllData);
    }
    getAllOfflineData(app: Express) {
        app.post('/v1/allofflinedata', dataController.getAllOfflineData);
    }
    searchData(app: Express) {
        app.get('/v1/search', dataController1.searchData);
    }

    findData(app: Express) {
        app.get('/v1/find-data', dataController1.findData);
    }

    statatics(app: Express) {
        app.get('/v1/statatics', dataController1.statatics);
    }
    updatePost(app: Express) {
        app.put('/v1/updatePost', dataController1.updatePost);
    }

    addPost(app: Express) {
        app.post('/v1/addPost', dataController1.addPost);
    }

    getAllPost(app: Express) {
        app.get('/v1/getAllPost', dataController1.getAllPost);
    }

    getPostById(app: Express) {
        app.post('/v1/getPostById', dataController1.getPostById);
    }

    addPlan(app: Express) {
        app.post('/v1/addplan', dataController.addPlan);
    }
    updatePlan(app: Express) {
        app.put('/v1/updateplan', dataController.updatePlan);
    }
    deletePost(app: Express) {
        app.post('/v1/deletePost', dataController1.deletePost);
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

    async translate(app: Express) {
        app.post('/v1/translate', dataController1.translate);
    }

    // htmlToPDF(app: Express) {
    //     app.post('/v1/html-to-pdf', dataController1.htmlToPDF)
    // }

    judgetmentInHTML(app: Express){
        app.get('/v1/html-judgement', dataController1.getFullJudgementInHtml)
    }

    // getFullJudgementById(app: Express){
    //     app.post('/v1/judgement-by-id',dataController1.getFullJudgementById);
    // }

    priorityUpdate(app: Express){
        app.put('/v1/priority-update',dataController1.priorityUpdate);
    }

    enablePost(app: Express){
        app.put('/v1/enable-post',dataController1.enablePost);
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
        this.updateLastId(app);
        this.uploadAndConvertExcel(app);
        this.getAllPost(app);
        this.getPostById(app);
        this.translate(app);
        // this.htmlToPDF(app);
        this.judgetmentInHTML(app);
        // this.getFullJudgementById(app);
        this.priorityUpdate(app);
        this.enablePost(app);
        this.findData(app);
    }
}