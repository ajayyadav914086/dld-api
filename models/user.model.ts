import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

let UserSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
  },
  enabled: {
    type: Boolean,
    required: false
  },
  fullName: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: Number,
    unique: true,
    required: true,
  },
  city: {
    type: String,
    required: true
  },
  planId: {
    type: Number,
    required: true
  },
  agentId: {
    type: Number,
    required: true
  },
  expiryDate: {
    type: Number,
    required: true
  },
  createdTimeStamp: {
    type: Date,
    required: false
  },
  lastLogin: {
    type: Date,
    required: false
  },
  isMobileVerified: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: Number,
    default: 0,
    required: true
  }
});

//hashing a password before saving it to the database
// UserSchema.pre('save', function (next) {
//   var user: any = this;
//   bcrypt.hash(user.password, 10, function (err: any, hash: any) {
//     if (err) {
//       return next(err);
//     }
//     user.password = hash;
//     next();
//   })
// });

// UserSchema.index({ email: "text" });
// Export the model
var User = mongoose.model('User', UserSchema);
module.exports = User;