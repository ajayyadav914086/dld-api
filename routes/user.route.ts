import { group, get, route, param, response, Doc, post, summary, SchemaBuilder, put, del } from 'doctopus';
import { Express } from 'express';
import { userController } from '../controllers/user.controller';

@group('User')
export default class UserRoute {
    @post
    @route('/v1/user')
    @summary('Register new user')
    @param({
        in: 'body',
        name: 'user',
        schema: Doc.inlineObj({
            fullName: Doc.string(),
            email: Doc.string(),
            phoneNumber: Doc.number(),
            password: Doc.string(),
            firebasetoken: Doc.string(),
            imei: Doc.number(),
        })
    })
    @response({
        description: 'will return user and token',
        schema: Doc.inlineObj({
            message: Doc.string(),
            status: Doc.number(),
            error: Doc.string(),
            responseCode: Doc.number(),
            result: Doc.inlineObj({
                _id: Doc.string(),
                __v: Doc.number(),
                fullName: Doc.string(),
                email: Doc.string(),
                phoneNumber: Doc.number(),
                password: Doc.string(),
                firebasetoken: Doc.string(),
                imei: Doc.number(),
            })
        })
    })
    addUser(app: Express) {
        app.post('/v1/user', userController.addUser);
    }

    getUser(app: Express) {
        app.get('/v1/user', userController.getUser);
    }

    updateUser(app: Express) {
        app.put('/v1/user', userController.putUser);
    }

    getToken(app: Express) {
        app.post('/v1/token', userController.token)
    }
    addBookmark(app: Express) {
        app.post('/v1/bookmark', userController.addBookmark);
    }
    removeBookmark(app: Express) {
        app.delete('/v1/bookmark', userController.removeBookmark);
    }
    viewBookmark(app: Express) {
        app.get('/v1/bookmark', userController.viewBookmark);
    }

    viewAllBookmark(app: Express) {
        app.post('/v1/allbookmarks', userController.viewAllBookmark);
    }

    activatePlan(app: Express) {
        app.post('/v1/activatePlan', userController.activatePlan);
    }

    allUser(app: Express) {
        app.post('/v1/users', userController.allUser);
    }

    sendNotification(app: Express) {
        app.post('/v1/notification', userController.sendNotification);
    }

    mail(app: Express) {
        app.post('/v1/mail', userController.mail);
    }

    getNotification(app: Express) {
        app.get('/v1/notification', userController.getNotifications);
    }


    sendNotificationToAll(app: Express) {
        app.post('/v1/notificationtoall', userController.sendNotificationToAll);
    }

    mailToAll(app: Express) {
        app.post('/v1/mailtoall', userController.mailToAll);
    }

    sendNotificationToAllExpired(app: Express) {
        app.post('/v1/notificationtoallexpired', userController.sendNotificationToAllExpired);
    }

    adminLogin(app: Express) {
        app.post('/v1/adminlogin', userController.adminLogin);
    }

    deleteUser(app: Express) {
        app.post('/v1/deleteuser', userController.deleteUser);
    }

    getMails(app: Express) {
        app.post('/v1/allmails', userController.viewAllMails);
    }

    uploadProfileImage(app: Express) {
        app.put('/v1/profileimage', userController.uploadProfileImage);
    }

    lastIdUpdate(app: Express) {
        app.put('/v1/lastidupdate', userController.lastIdUpdate);
    }

    @post
    @route('/v1/forget')
    @summary('Forget Password')
    @param({
        in: 'body',
        name: 'user',
        schema: Doc.inlineObj({
            phoneNumber: Doc.number(),
        })
    })
    @response({
        description: 'Sends otp to user',
        schema: Doc.inlineObj({
            message: Doc.string(),
            status: Doc.number(),
            error: Doc.string(),
            responseCode: Doc.number(),
        })
    })

    forgetPassword(app: Express) {
        app.post('/v1/forget', userController.forgetPassword);
    }

    @post
    @route('/v1/verifypassword')
    @summary('Verify OTP and change Password')
    @param({
        in: 'body',
        name: 'user',
        schema: Doc.inlineObj({
            userID: Doc.string(),
            otp: Doc.number(),
            password: Doc.string()
        })
    })
    @response({
        description: 'will verify otp and change password',
        schema: Doc.inlineObj({
            message: Doc.string(),
            status: Doc.number(),
            error: Doc.string(),
            responseCode: Doc.number(),
        })
    })

    verifyOTPAndChangePassword(app: Express) {
        app.post('/v1/verifypassword', userController.verifyOTPAndChangePassword);
    }

    changePassword(app: Express) {
        app.put('/v1/password-change', userController.changePassword);
    }

    editAccount(app: Express) {
        app.put('/v1/edit-account', userController.editAccount);
    }

    getTokenUser(app: Express) {
        app.get('/v1/token-user', userController.getTokenUser);
    }

    changePhoneNumber(app: Express) {
        app.put('/v1/change-phone', userController.changePhoneNumber);
    }

    userRoute(app: Express) {
        this.addUser(app);
        this.getUser(app);
        this.getToken(app);
        this.updateUser(app);
        this.viewBookmark(app);
        this.viewAllBookmark(app);
        this.addBookmark(app);
        this.removeBookmark(app);
        this.activatePlan(app);
        this.allUser(app);
        this.deleteUser(app);
        this.sendNotification(app);
        this.getNotification(app);
        this.sendNotificationToAll(app);
        this.sendNotificationToAllExpired(app);
        this.adminLogin(app);
        this.mail(app);
        this.mailToAll(app);
        this.getMails(app);
        this.forgetPassword(app);
        this.verifyOTPAndChangePassword(app);
        this.uploadProfileImage(app);
        this.lastIdUpdate(app);
        this.changePassword(app);
        this.editAccount(app);
        this.getTokenUser(app);
        this.changePhoneNumber(app);
    }
}