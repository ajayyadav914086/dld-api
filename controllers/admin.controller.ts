
const jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var AdminsRole = require('../models/adminRole.model')

export default class AdminController{
    createAdminRoles = function(req: any, res: any){
        AdminsRole.create({ name: req.body.name }, (error: any, result: any) => {
            if (error) {
                return res.send({
                    message: 'Unauthorized DB Error',
                    responseCode: 700,
                    status: 200,
                    error: error
                });
            } else {
                return res.send({
                    message: 'Role Created',
                    responseCode: 20000,
                    status: 200,
                    result: result
                })
            }
        })
    }

    
}

export const adminController = new AdminController();