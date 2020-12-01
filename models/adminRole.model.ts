import mongoose from 'mongoose';

let AdminRolesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

var AdminRole = mongoose.model('AdminRole', AdminRolesSchema);
module.exports = AdminRole;