var mongoose = require('mongoose')
// SALT_WORK_FACTOR = 10
// BCRYPT_SALT_ROUNDS =10
// var bcrypt=require('bcrypt')
var schema = new mongoose.Schema({
    _id: Number,
    // facebook_id : String,
    // google_id :String,
    social_id: String,

    admin_status:{ type: String, default: "Active" },
    status: {type: String  },
    // image: String,
    gender: String,
    referal_code: String,
    // mobilenumber: {type:String,minlength:'10',maxlength:'10'},
    mobilenumber: { type: String },
    email: {
        type: String,
        // unique: true
    },
    mobile_email: String,
    // otp: String,
    password: String,
    email_mobilenumber: String,
    firstname: String,
    lastname: String,
    dob: String,
    sms_key: String,
    verified: {
        type: String, default: "0"
    }
}, { versionKey: false })
// schema.pre('save', function(next){
//     var user = this;
//     if (!user.isModified('password')) return next();

//     bcrypt.genSalt(BCRYPT_SALT_ROUNDS, function(err, salt){
//         if(err) return next(err);

//         bcrypt.hash(user.password, salt, function(err, hash){
//             if(err) return next(err);

//             user.password = hash;
//             next();
//         });
//     });
// });
module.exports = mongoose.model('customer_table', schema)