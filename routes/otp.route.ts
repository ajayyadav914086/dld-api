import { group, get, route, param, response, Doc, post, summary, del, patch, put } from 'doctopus';
import { Express } from 'express';
import { otpController } from '../controllers/otp.controller';

@group('OTP')
export default class OTPRoute {
    @post
    @route('/v1/verify')
    @summary('Verify otp for user number validation.')
    @param({
        in: 'header',
        name: 'token',
        description: 'JWT token for authentication',
        type: 'string'
    })
    @param({
        in: 'body',
        name: 'verify',
        schema: Doc.inlineObj({
            otp: Doc.number()
        })
    })
    @response({
        description: 'will return status message.',
        schema: Doc.inlineObj({
            message: Doc.string(),
            status: Doc.number(),
            error: Doc.string(),
            responseCode: Doc.number()
        })
    })

    verifyOtp(app: Express) {
        app.post('/v1/verify', otpController.verifyOtp);
    }

    @post
    @route('/v1/otp')
    @summary('resend otp.')
    @param({
        in: 'header',
        name: 'token',
        description: 'JWT token for authentication',
        type: 'string',
    })
    @response({
        description: 'will return status message.',
        schema: Doc.inlineObj({
            message: Doc.string(),
            status: Doc.number(),
            error: Doc.string(),
            responseCode: Doc.number()
        })
    })

    resendOtp(app: Express) {
        app.post('/v1/resend', otpController.resendOtp)
    }

    @post
    @route('/v1/emailotp')
    @summary('send otp to email for verification.')
    @param({
        in: 'header',
        name: 'token',
        description: 'JWT token for authentication',
        type: 'string',
    })
    @response({
        description: 'will return status message.',
        schema: Doc.inlineObj({
            message: Doc.string(),
            status: Doc.number(),
            responseCode: Doc.number()
        })
    })    
    generateEmailOtp(app: Express) {
        app.post('/v1/emailotp', otpController.sendEmailOtp)
    }

    @post
    @route('/v1/emailverify')
    @summary('verify email.')
    @param({
        in: 'header',
        name: 'token',
        description: 'JWT token for authentication',
        type: 'string',
    })
    @param({
        in: 'body',
        name: 'verify',
        schema: Doc.inlineObj({
            otp: Doc.number()
        })
    })
    @response({
        description: 'will return status message.',
        schema: Doc.inlineObj({
            message: Doc.string(),
            status: Doc.number(),
            responseCode: Doc.number(),
            error: Doc.string()
        })
    })
    verifyEmailOtp(app: Express) {
        app.post('/v1/emailverify', otpController.verifyEmailOtp)
    }

    @post
    @route('/v1/changeemail')
    @summary('change your email.')
    @param({
        in: 'header',
        name: 'token',
        description: 'JWT token for authentication',
        type: 'string',
    })
    @param({
        in: 'body',
        name: 'change email',
        schema: Doc.inlineObj({
            email: Doc.string()
        })
    })
    @response({
        description: 'will return status message.',
        schema: Doc.inlineObj({
            message: Doc.string(),
            status: Doc.number(),
            responseCode: Doc.number(),
            error: Doc.string()
        })
    })
    changeEmail(app: Express) {
        // app.post('/v1/changeemail', otpController.changeEmail)
    }


    otpRoute(app: Express) {
        this.verifyOtp(app);
        this.resendOtp(app);
        this.generateEmailOtp(app);
        this.verifyEmailOtp(app);
        this.changeEmail(app);
    }
}