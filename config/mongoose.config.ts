import mongoose from "mongoose";

let dev_db_url =
  "mongodb+srv://ajay7722:ajay2020@cluster1.qkzux.mongodb.net/dev?retryWrites=true&w=majority";
let mongoDB = process.env.MONGODB_URI || dev_db_url;

mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected To Database");
  });

mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
module.exports.mongoose;
