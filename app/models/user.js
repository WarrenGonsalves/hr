var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    name: String,
    phone: Number,
    password: { type: String, select: false },
    email: { type: String,unique: true},
    googleId: String,
    picture: String,
    createdDate: {
        type: Date,
        default: Date.now
    },
    type: {                     //ADM, EMP, MGR
        type: String,
        select: false,
        default: 'EMP',
        enum: ['ADM', 'MGR', 'EMP']
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive']
    }
});

module.exports = mongoose.model('User', UserSchema);