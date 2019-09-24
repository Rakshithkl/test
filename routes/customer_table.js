var express = require('express')
var mongoose = require('mongoose')
var customer_table = require('../models/customer_table')
var otp_detail = require('../models/otp_table')
var temp = require('../models/temp')
var router = express.Router()
var request = require('request');
var nodemailer = require('nodemailer')
var jwt = require('jsonwebtoken');





// jwt validation start here
function verifytoken(req, res, next) {
    const get_headerdata = req.headers['authorization'];
    if (typeof get_headerdata !== 'undefined') {
        const getheader = get_headerdata;
        const headertoken = getheader;
        req.token = headertoken;
        next();
    } else {
        console.log('error');
    }
}
// jwt validation end here

// login with jwt start

//........................................................................
//crrct
// //admin active status


//crrct
router.post('/admin_status', async (req, res) => {
    let { _id, admin_status } = req.body
    if (admin_status == 'Active') {
        await customer_table.findByIdAndUpdate(_id, { admin_status, status: '1' }, (err, data) => {

            if (err) {
                res.json({
                    status: 'failed',

                })
            } else {
                res.json({
                    status: 'success',
                    message: 'user is Active...!',

                })
            }
        })
    } else
        if (admin_status == 'block') {
            await customer_table.findByIdAndUpdate(_id, { admin_status, status: '0' }, (err, data) => {

                if (err) {
                    res.json({
                        status: 'failed',

                    })
                } else {
                    res.json({
                        status: 'success',
                        message: 'user is blocked...!',

                    })
                }
            })
        } else
            await customer_table.findByIdAndUpdate(_id, { admin_status: 'delete' }, (err, data) => {
                if (admin_status == 'delete') {
                    customer_table.findByIdAndDelete(_id, { admin_status: 'delete' }, (err, data1) => {

                        if (err) {
                            res.json({
                                status: 'failed',

                            })
                        } else {
                            res.json({
                                status: 'success',
                                message: 'user is deleted...!',

                            })
                        }

                    })
                }
            })

})


router.post('/login', (req, res, next) => {
    let { mobile_email, password, status } = req.body
    let search;
    if (req.body.mobile_email != null) {


        if (req.body.status != 0) {


            if (mobile_email.indexOf("@") > -1) {
                search = "email"
            } else {
                search = "mobilenumber"
            }

            customer_table.findOne({ [search]: mobile_email, password, status: "1" }, (err, user) => {
                customer_table.findOne({ admin_status: "block" }, (err, admin) => {
                    customer_table.findOne({ [search]: mobile_email, password }, (err, both) => {
                        customer_table.findOne({ password }, (err, pass) => {
                            customer_table.findOne({ [search]: mobile_email }, (err, emailll) => {


                                if (err) throw err;

                                if (!both) {
                                    if (!pass && !emailll) {
                                        return res.json({
                                            status: 'failed',
                                            message: 'user not exist..!!',

                                        })
                                    }
                                    else if (!emailll) {

                                        return res.json({
                                            status: 'failed',
                                            message: 'wrong email or mobilenumber...!',

                                        })
                                    }
                                    else if (!pass) {

                                        return res.json({
                                            status: 'failed',
                                            message: 'wrong password...!',

                                        })
                                    }
                                    else {
                                        return res.json({
                                            status: 'failed',
                                            message: 'both ', result: user,

                                        })
                                    }
                                }
                                else if (user) {

                                    console.log(user)
                                    // console.log(res);
                                    jwt.sign({ user: user }, 'secretkey', (err, token) => {
                                        res.json({
                                            status: 'success',
                                            message: 'login sucessfully',
                                            result: user,
                                            token: token
                                        });
                                    });
                                }

                                else {
                                    return res.json({
                                        "status": "failed",
                                        "message": "user blocked...!"
                                    });
                                }
                                // });

                            });
                        })
                    })
                })
            })
        }
        else {
            res.json({ message: " not approved" })
        }
    }
    else {
        res.json({ status: 'failed', message: "please enter email and password for login!......" })
    }

});



router.post('/social_login_reg', (req, res) => {
    customer_table.find((err, data) => {

        var { email } = req.body
        customer_table.findOne({ email }, (err, data) => {
            if (err) { throw err }
            // if (data) {
            //     return res.json({
            //         status: "failed",
            //         message: " email already exists"
            //     })
            // } else
            if (req.body.social_id != null) {

                let { email, mobilenumber, social_id, firstname, otp } = req.body

                let _id = Math.floor(100000 + Math.random() * 900000)
                _id = Number(_id)
                customer_table.findOne({ social_id }, (err, data) => {
                    if (err) return res.json({ status: false, message: "failed" })
                    if (data) {
                        jwt.sign({ data: data }, 'secretkey', (err, token) => {

                            // temp.otp = otp
                            res.json({
                                status: 'success',
                                message: 'login sucessfully!',
                                result: data,
                                token: token
                            })
                        })
                    }
                    else {
                        customer_table.find((err, data) => {

                            // var _id = data.length + 1
                            // req.body._id = _id

                            let recentDoc = data[data.length - 1]
                            recentDoc = recentDoc.toObject()
                            let recentDocId = parseInt(recentDoc._id, 10)
                            req.body._id = recentDocId + 1

                            customer_table.create(req.body, (err, data) => {

                                jwt.sign({ data: data }, 'secretkey', (err, token) => {

                                    // temp.otp = otp
                                    res.json({
                                        status: 'success',
                                        message: 'successfully registered',
                                        result: data,
                                        token: token
                                    })
                                })
                            })
                        })


                    }
                })


            }

            else {
                res.json({ status: 'failed', message: "Failed to register" })
            }
        })
        // })
    })
})

router.post('/api', (req, res) => {

    nodemailer.createTestAccount((err, account) => {
        let { email } = req.body
        customer_table.find((err, data) => {
            if (req.body.mobilenumber != null) {
                // var referal_code = "VP-" + Math.floor(100000 + Math.random() * 900000)
                let { email, mobilenumber, otp, password, sms_key  } = req.body
                let _id = Math.floor(100000 + Math.random() * 900000)
                _id = String(_id)

                if (req.body.mobilenumber.length == 10) {

                    customer_table.findOne({ email }, (err, data) => {
                        if (err) return res.json({ status: false, message: "failed" })
                        if (data) {
                            res.json({ status: 'failed', message: "email already exists" })
                        } else {
                            customer_table.findOneAndUpdate({ mobilenumber }, { otp, verified: "0" }, (err, data) => {
                                if (err) return res.json({ status: false, message: "failed" })
                                if (data) {
                                    res.json({ status: 'failed', message: "phone already exists" })
                                } else {
                                    customer_table.find((err, data) => {
                                        temp.find((err, data) => {


                                            // var _id = data.length + 1
                                            // req.body._id = _id

                                            // let recentDoc = data[data.length - 1]
                                            // recentDoc = recentDoc.toObject()
                                            // let recentDocId = parseInt(recentDoc._id, 10)
                                            // req.body._id = recentDocId + 1
                                            if (data.length > 0) {

                                                let recentDoc = data[data.length - 1]
                                                recentDoc = recentDoc.toObject()
                                                let recentDocId = parseInt(recentDoc._id, 10)
                                                req.body._id = recentDocId + 1
                                            } else {
                                                var _id = data.length + 1
                                                req.body._id = _id
                                            }

                                            // req.body._id = data.length + 1

                                            var otp = Math.floor(1000 + Math.random() * 9000);
                                            var referal_code = "CT-" + Math.floor(100 + Math.random() * 900)//generating referal code 
                                            req.body.referal_code = referal_code
                                            // let otp = Math.floor(Math.random() * 9999)
                                            req.body.otp = String(otp)
                                            var verified = req.body

                                            console.log(req.body.mobilenumber);
                                            var url = 'http://smsbizcenter.in/http-api.php?username=citygrocer&password=12345&senderid=ctgrcr&route=2&number=' + req.body.mobilenumber + '&message=' + 'City Grocery Registration otp verification code-' + otp + '&format=json';
                                            // var url = 'http://smsbizcenter.in/http-api.php?username=citygrocer&password=12345&senderid=ctgrcr&route=2&number=' + req.body.mobilenumber + '&message=' + 'City Grocery Registration otp verification  code-' ' OTP is-'+ otp  + '&format=json';
                                            console.log(url);
                                            request(url, (error, response, body) => {
                                                console.log(response.body);
                                                console.log(body);
                                                if (error) console.log(error)

                                                console.log(req.body)

                                                customer_table.referal_code = referal_code
                                                otp_detail.find((err, resp) => {
                                                    var request_otp_param = {
                                                        _id: resp.length + 1,
                                                        email: data.body,
                                                        mobilenumber: data.mobilenumber,
                                                        otp: data.otp,
                                                        msgid: response.body,
                                                        createBy: "signup"
                                                    }

                                                    otp_detail.create(request_otp_param, (err, data) => {
                                                        temp.create(req.body, (err, data) => {
                                                            jwt.sign({ data: data }, 'secretkey', (err, token) => {
                                                                var transporter = nodemailer.createTransport({
                                                                    service: 'gmail',
                                                                    auth: {
                                                                        user: 'sudharani.b@fugenx.com',
                                                                        pass: 'Fug@1234$'
                                                                    }
                                                                });

                                                                var mailOptions =
                                                                {
                                                                    from: 'sudharani.b@fugenx.com',
                                                                    to: data.email,
                                                                    subject: 'OTP Notification!..',
                                                                    text: data.message,
                                                                    otp: data.otp,
                                                                    html: '<p><b>City Grocer OTP is </b></p>' + otp

                                                                };

                                                                transporter.sendMail(mailOptions, (err, info) => {
                                                                    if (err) {
                                                                        console.log('Error occurred. ' + err.message);
                                                                        return process.exit(1);
                                                                    } else {
                                                                        if (err) { throw err } else { res.json({ "Status": "Success", "result": [data] }) }
                                                                        // res.json(password);

                                                                        db.close();
                                                                    }
                                                                    console.log('Message sent: %s', info.messageId)
                                                                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                                                                });

                                                                temp.otp = otp

                                                                res.json({
                                                                    status: 'success',
                                                                    message: 'successfully registered',
                                                                    result: data,
                                                                    token: token
                                                                })
                                                            })
                                                        })
                                                    })
                                                });
                                            })

                                        })
                                    })


                                }
                            })
                        }
                    })

                }

                else {
                    res.json({ status: 'failed', message: "mobile number should be 10 digits" })
                }
            }

            else {
                res.json({ status: 'failed', message: "Failed to register" })
            }
        })
    })
})


//reg social login


//.....................................................................


router.post('/update', (req, res, next) => {
    let { _id } = req.body
    temp.findOneAndUpdate({ _id }, req.body, (err, data) => {
        temp.findOne({ _id: _id }, (err, data) => {
            if (err) console.log(err)
            if (!data) {
                res.json({
                    status: 'failed',
                    message: 'failed to display'
                })
            } else {
                res.json({
                    status: 'success',
                    message: 'successfully  updated',
                    result: data
                })
            }
        })
    })
})


//view by category name
router.post('/editby_id', function (req, res) {
    let { _id: _id } = req.body
    temp.findOne({ _id }, (err, data) => {
        if (err) {
            res.json({
                status: 'failed',
                message: 'failed to display'
            })
        }

        return res.json({
            status: 'success',
            message: 'successfully  updated',
            result: data
        })
    })
})
//.....................................................................

router.post('/getuser', verifytoken, (req, res) => {
    jwt.verify(req.token, 'secretkey', function (err, data) {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'getdata',
                data: data
            })
        }
    })

})




//by admin approve
router.post('/approve', (req, res, next) => {
    let { _id, status } = req.body
    customer_table.findOneAndUpdate({ _id }, { status }, (err, data) => {
        customer_table.findOne({ _id: _id }, (err, data) => {
            if (err) {
                res.json({
                    status: 'failed',
                    message: 'failed to display'
                })
            }
            else if (!data) {
                res.json({
                    status: "failed",
                    message: "No data"
                })
            }
            else {
                res.json({
                    status: 'success',
                    message: 'successfully  approved',
                    result: [data]
                })
            }
        })
    })

})

//forgotpassword
router.post('/forgotpassword', (req, res, next) => {
    debugger
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    // process.env.IPFSPROTCOL
    let { email: email } = req.body
    let { mobile_email } = req.body
    let searchKey; searchObject = {}
    var otp = Math.floor(1000 + Math.random() * 9000);
    // let otp = Math.floor(Math.random() * 9999)
    otp = String(otp)
    if (mobile_email.indexOf('@') > -1) {
        searchKey = "email"
    } else {
        searchKey = "mobilenumber"
    }
    searchObject[searchKey] = mobile_email
    temp.findOneAndUpdate(searchObject, { otp }, (err, data) => {
        temp.findOne({ otp: otp }, (err, data) => {
            var { email } = req.body
            console.log(mobile_email)
            if (err) next(err)
            if (!data) res.json({
                status: "failed",
                message: "user not exist...!",

            });
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'sudharani.b@fugenx.com',
                    pass: 'Fug@1234$'
                }

            });
            let mailOptions = {
                from: 'sudharani.b@fugenx.com',
                to: data.email,
                subject: "Forgotten password Verification..!",
                text: "City Grocer  otp  is : " + otp

            };
            console.log(mailOptions)
            var url = 'http://smsbizcenter.in/http-api.php?username=citygrocer&password=12345&senderid=ctgrcr&route=2&number=' + req.body.mobile_email + '&message=' + 'City Grocery forgot password otp verification code-' + otp + '&format=json';
            request(url, (err, response, body) => {
                if (err) console.log(err)
                console.log(body)
                if (!data) {
                    res.json({
                        status: "failed",
                        message: "failed to send otp",

                    });
                } else {
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                            // res.json(info.response)
                            if (!data) {
                                res.json({
                                    status: "failed",
                                    message: "failed to send otp",

                                });
                            } else {
                                return res.json({
                                    status: 'success',
                                    message: 'OTP sent successfully',
                                    result: [{ otp: otp }]
                                })
                            }

                        }
                    });
                }

            })
        })
    })
})


// reset_password
router.post('/reset_password', (req, res, next) => {
    if (req.body.password != null) {
        let { otp, password, _id } = req.body
        // temp.findOneAndUpdate({ otp }, { password }, { verified: "1" }, (err, data) => {
        temp.findOneAndUpdate({ otp }, { password }, (err, data) => {
            temp.findOne({ otp: otp, password: password }, (err, data) => {
                customer_table.create(data, (err, data) => {
                    if (err) next(err)
                    if (data) {
                        res.json({
                            status: 'success',
                            message: 'password reset successfully',
                            result: [data]
                        })
                    }

                    else {

                        res.json({
                            status: 'failed',
                            message: 'failed to reset password'

                        })
                    }
                })
            })
        })
    }
    else {
        res.json({ status: 'failed', message: "please enter password for reset........" })
    }

})




//verify both email and mobile number
router.post('/verify', (req, res) => {
    if (req.body.mobile_email != null) {


        let { mobile_email, otp, } = req.body
        let search, searchObject = { otp }
        if (mobile_email.indexOf("@") > -1) {
            search = "email"
        } else {
            search = "mobilenumber"
        }
        searchObject[search] = mobile_email
        // valet_boy_managements.findOneAndUpdate(searchObject, { verified: "1" }, (err, data) => {

        temp.findOneAndUpdate(searchObject, { status: "1" }, function (err, data) {
            temp.findOne({ otp: otp }, (err, data) => {

                if (mobile_email == req.body.mobile_email && otp == req.body.otp)
                    if (err) { res.json({ message: "Incorrect" }) } console.log(err)
                if (!data) {
                    res.json({
                        status: "failed",
                        message: "otp verification failed",

                    });
                } else {
                    requestparam = {
                        mobilenumber: data.mobilenumber,
                        email: data.email,
                        firstname: data.firstname,
                        lastname: data.lastname,
                        gender: data.gender,
                        // referal_code: data.referal_code,
                        password: data.password,
                        status: data.status,
                        social_id: data.social_id,
                        admin_status: data.admin_status,
                        // google_id:data.google_id,
                        sms_key: data.sms_key,
                        _id: data._id,
                        otp: data.otp

                    }


                    console.log(requestparam)
                    customer_table.create(requestparam, (err, data) => {

                        console.log(data);

                        return res.json({
                            status: 'success',
                            message: 'successfully  verified',
                            result: requestparam
                        })
                    })
                }
            })
            // })
        })
    }
    else {
        res.json({ status: 'failed', message: "please enter mobilenumber and otp for verify!........" })
    }
})

//verify both email and mobile number
router.post('/vvvverify', (req, res) => {
    if (req.body.mobile_email != null) {


        let { mobile_email, otp, } = req.body
        let search, searchObject = { otp }
        if (mobile_email.indexOf("@") > -1) {
            search = "email"
        } else {
            search = "mobilenumber"
        }
        searchObject[search] = mobile_email
        // valet_boy_managements.findOneAndUpdate(searchObject, { verified: "1" }, (err, data) => {

        temp.findOneAndUpdate(searchObject, { status: "1" }, function (err, data) {
            temp.findOne({ otp: otp }, (err, data) => {

                if (mobile_email == req.body.mobile_email && otp == req.body.otp)
                    if (err) { res.json({ message: "Incorrect" }) } console.log(err)
                if (!data) {
                    res.json({
                        status: "failed",
                        message: "otp verification failed",

                    });
                } else {
                    requestparam = {
                        mobilenumber: data.mobilenumber,
                        email: data.email,
                        firstname: data.firstname,
                        lastname: data.lastname,
                        gender: data.gender,
                        // referal_code: data.referal_code,
                        password: data.password,
                        status: data.status,
                        social_id: data.social_id,
                        admin_status: data.admin_status,
                        // google_id:data.google_id,
                        sms_key: data.sms_key,
                        _id: data._id

                    }


                    console.log(requestparam)
                    customer_table.create(requestparam, (err, data) => {

                        console.log(data);

                        return res.json({
                            status: 'success',
                            message: 'successfully  register',
                            result: [requestparam]
                        })
                    })
                }
            })
            // })
        })
    }
    else {
        res.json({ status: 'failed', message: "please enter mobilenumber and otp for verify!........" })
    }
})

// change_password
router.post('/change_password', (req, res) => {
    // if(req.body.password!=null){
    var { password, _id } = req.body
    temp.findByIdAndUpdate(_id, { password }, (err, data) => {
        temp.findOne({ _id: _id }, (err, data1) => {
            customer_table.create(data1, (err, data) => {
                if (err) { throw err }
                if (data) {
                    res.json({
                        status: 'success',
                        message: 'password changed successfully',
                        result: [data]
                    })
                } else {

                    res.json({
                        status: 'failed',
                        message: 'failed to change password'
                    })
                }
            })
        })
    })
})

//only mobilenumber not both mobile or email
router.post('/notresendotp', (req, res) => {
    if (req.body.mobilenumber != null) {
        let { mobilenumber } = req.body
        temp.findOne({ mobilenumber }, (err, data) => {
            if (err) console.log(err)
            if (data) {
                var otp = Math.floor(1000 + Math.random() * 9000);
                // let otp = Math.floor(Math.random() * 9999)
                req.body.otp = String(otp)
                var url = 'http://smsbizcenter.in/http-api.php?username=citygrocer&password=12345&senderid=ctgrcr&route=2&number=' + req.body.mobilenumber + '&message=' + 'City Grocery otp verification code-' + otp + '&format=json';
                request(url, (error, response, body) => {
                    temp.findOneAndUpdate({ mobilenumber }, { otp }, (err, data) => {
                        temp.findOne({ otp: otp }, (err, data) => {
                            if (!data) {
                                res.json({
                                    status: "failed",
                                    message: "fail to send otp",

                                });
                            } else {
                                return res.json({
                                    status: 'success',
                                    message: 'successfully  otp sent',
                                    result: [data]
                                })
                            }

                        })
                    })
                })
            }
        })
    }
    else {
        res.json({ status: 'failed', message: "please enter mobilenumber and otp for verify!........" })
    }
})



//forgotpassword
router.post('/resendotp', (req, res, next) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    // process.env.IPFSPROTCOL
    let { email: email } = req.body
    let { mobile_email } = req.body
    let searchKey; searchObject = {}
    var otp = Math.floor(1000 + Math.random() * 9000);
    // let otp = Math.floor(Math.random() * 9999)
    otp = String(otp)
    if (mobile_email.indexOf('@') > -1) {
        searchKey = "email"
    } else {
        searchKey = "mobilenumber"
    }
    searchObject[searchKey] = mobile_email

    temp.findOneAndUpdate(searchObject, { otp }, (err, data) => {
        temp.findOne({ otp: otp }, (err, data) => {
            var { email } = req.body
            console.log(mobile_email)
            if (err) next(err)
            if (!data) res.json({
                status: "failed",
                message: "failed to send otp",
            });



            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'sudharani.b@fugenx.com',
                    pass: 'Fug@1234$'
                }

            });
            let mailOptions = {
                from: 'sudharani.b@fugenx.com',
                to: data.email,
                subject: "Forgotten password Verification is",
                text: "City Grocer otp  is : " + otp

            };
            console.log(mailOptions)
            var url = 'http://smsbizcenter.in/http-api.php?username=citygrocer&password=12345&senderid=ctgrcr&route=2&number=' + req.body.mobile_email + '&message=' + 'City Grocery forgot otp verification code-' + otp + '&format=json';
            request(url, (err, response, body) => {
                if (err) console.log(err)
                console.log(response.body)
                //     if (!data) {
                //         res.json({
                //             status: "failed",
                //             message: "failed to send otp",

                //         });
                //     } else {
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        // res.json(info.response)
                        if (!data) {
                            res.json({
                                status: "failed",
                                message: "failed to send otp",

                            });
                        } else {
                            return res.json({
                                status: 'success',
                                message: 'OTP resent successfully',
                                result: [{ otp: otp }]
                            })
                        }

                    }
                });
                //     }

            })
        })
    })
})




module.exports = router