const Data = require('../models/data.model');
const Plan = require('../models/plan.model');
const Payment = require('../models/payment.model');

const CountSchema = require('../models/counts.model');
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

export default class Data1Controller {
    addPost = function(req: any, res: any){
        
    }

}

export const dataController1 = new Data1Controller();
