// var express = require('express')
// var super_admin = require('../models/super_admin')
// var router = express.Router()


var express = require('express')
//var app=express()
var super_admin = require('../models//super_admin')
var router = express.Router()
var bcrypt = require('bcrypt')
var nodemailer = require('nodemailer')
//app.use(cors())


router.post('/add', (req, res) => {
    super_admin.find((error, allcar_make) => {

        // let recentDoc = data1[data1.length-1]
        // recentDoc = recentDoc.toObject()
        // let recentDocId = parseInt(recentDoc._id,10)
        // req.body._id = recentDocId +1

        var _id = allcar_make.length + 1
        req.body._id = _id
        
        super_admin.create(req.body, (err, data) => {
            if (err) {
                res.json({
                    status: 'failed',
                    message: 'failed to display'
                })
            } else {
                return res.json({
                    status: 'Success',
                    message: 'successfully  super_admin is added',
                    result: [data]
                })
            }
        })
    })
})


router.post('/login', (req, res, next) => {
    let { mobile_email, password } = req.body
    let search;
    if (mobile_email.indexOf("@") > -1) {
        search = "email"
    } else {
        search = "mobilenumber"
    }
    super_admin.findOne({ [search]: mobile_email ,password}, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({
                "Status": "Failed",
                "message": "Invalid login credentials.."
            });
        } else {
            // bcrypt.compare(password, user.password, function (err, resultdata) {
                console.log(user)
                res === true
                if (user) {
                    console.log(user)
                    // console.log(res);
                    return res.json({
                        status: 'success',
                        message: 'login sucessfully',
                        result: [user]
                    })
                } else {
                    return res.json({
                        "status": "failed",
                        "message": "fail to login"
                    });
                }
            // });
        }
    });

});


module.exports=router
