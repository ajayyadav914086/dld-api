import mongoose from "mongoose";
import * as bcrypt from "bcryptjs";

let UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    unique: true,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  reference: {
    type: Number,
  },
  planId: {
    type: mongoose.Types.ObjectId,
  },
  agentId: {
    type: Number,
  },
  expiryDate: {
    type: Number,
  },
  isFreePlanUsed: {
    type: Boolean,
    default: false
  },
  isPlanActivied: {
    type: Boolean,
    default: false
  },
  planExpiryDate: {
    type: Date,
    default: Date.now
  },
  planStartDate: {
    type: Date
  },
  isMobileVerified: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  isHindi: {
    type: Boolean
  },
  isMarathi: {
    type: Boolean
  },
  isGujarati: {
    type: Boolean
  },
  planType: {
    type: Number
  },
  notificationCount: {
    type: Number,
    default: 0,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now()
  },
  accessToken: {
    type: String
  }
});

//hashing a password before saving it to the database
UserSchema.pre("save", function (next: any) {
  var user: any = this;
  bcrypt.hash(user.password, 10, function (err: any, hash: any) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

// UserSchema.index({ email: "text" });
// Export the model
var User = mongoose.model("User", UserSchema);
module.exports = User;
