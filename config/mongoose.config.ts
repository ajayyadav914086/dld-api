import mongoose from 'mongoose';

let dev_db_url = 'mongodb+srv://ajay7722:ajay2020@cluster0.qkzux.gcp.mongodb.net/Dld?retryWrites=true&w=majority';
let mongoDB = dev_db_url;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connected To Database");
});

mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
module.exports.mongoose;
