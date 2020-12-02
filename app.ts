import express from 'express';
import FirebaseNotification from './config/firebase.config';
import DataController from './controllers/data.controller';
import AdminRoute from './routes/admin.route';
import DataRoute from './routes/data.route';
import OTPRoute from './routes/otp.route';
import UserRoute from './routes/user.route';
var port = process.env.PORT || 3005;
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var mangoos = require('./config/mongoose.config');
const swagger = require('./routes/swagger');
var cors = require('cors');
var cron = require('node-cron');


var app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', swagger);
// app.use(cors({ origin: 'https://dev.bauktion.com' }));
FirebaseNotification.initFirebaseConfig();
app.use(cors());
app.options('*', cors());
const userRoute = new UserRoute();
userRoute.userRoute(app);
const dataRoute = new DataRoute();
dataRoute.dataRoute(app);
const otpRoute = new OTPRoute()
otpRoute.otpRoute(app);
const adminRoute = new AdminRoute();
adminRoute.adminRoute(app);


// cron.schedule("00 08 * * *", () => {
//     DataController.dailyInternalData();
//     console.log('running a task every at 10:00');
// });
app.listen(port,()=>{
    console.log('Server is up and running on port numner ' + port);
});