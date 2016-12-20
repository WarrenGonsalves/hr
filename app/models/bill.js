var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BillSchema   = new Schema({
    paidTo: String,
    date: Date,
    amount: Number,
    createdDate: {
        type: Date,
        default: Date.now
    },
    category: {                     
        type: String,
        default: 'other',
        // enum: ['mobile', 'food', 'rent']
    },
    status: {
        type: String,
        default: 'paid',
        enum: ['paid', 'unpaid']
    }
});

module.exports = mongoose.model('Bill', BillSchema);