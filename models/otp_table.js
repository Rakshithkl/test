var mongoose = require('mongoose')
var schema = new mongoose.Schema({
_id: String,
mobilenumber: {type:String,minlength:'10',maxlength:'10',},
email: String, 
otp: String,
msgid:String,
createOn: { type: Date, default: Date.now },
createBy:String

}, { versionKey: false })

module.exports = mongoose.model('otp_detail', schema)