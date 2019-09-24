var express = require('express')
var banner = require('../models/banner')

var banner2 = require('../models/banner2')
var banner3=require('../models/banner3')
var offer_banner4=require('../models/offer_banner4')
var banneradd=require('../models/banneradd')
var bannershare=require('../models/bannershare')

var router = express.Router()
var morgan=require('morgan')
var upload=require('../models/banner')

router.post('/banner_add', (req, res) => {
    if(req.body!=null){
    banner.find((error, data) =>  {

      
        if (data.length > 0) {

            let recentDoc = data[data.length - 1]
            recentDoc = recentDoc.toObject()
            let recentDocId = parseInt(recentDoc._id, 10)
            req.body._id = recentDocId + 1
        } else {
            var _id = data.length + 1
            req.body._id = _id
        }
        
        var _id_category=req.body
        banner.create(_id_category, (err, data) => {
             if (err) {
                res.json({
                    status: 'failed',
                    message: 'failed to display'
                })
            } else if(!data){
                res.json({ status: 'failed',})
               
            }
            else {
                return res.json({
                    status: 'success',
                    message: 'successfully  banner is added',
                    result: [data]
                })
            }   
        })
    })
}

else{
    res.json({message:"Failed"})
}
})

router.post('/banner_delete', function (req, res) {
    let { _id} = req.body
    
    banner.findByIdAndDelete({ _id}, function (err, data) {
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
        res.json({
            status: 'success',
            message: 'sucessfully  banner is deleted',
            result: [data]
        });
    })
})

router.get('/banner_get', (req, res) => {
   
    banner.find( (err, data) => {
        if (err) {
            res.json({
                status: 'failed',
                message: 'failed to display'
            })
        }
        return res.json({
            status: 'success',
            message: 'successfully  banner is displayed',
            result: data
        })
    })
})

router.post('/banner_edit', (req, res, next) => {
    let { _id } = req.body
    banner.findOneAndUpdate({ _id }, req.body, (err, data) => {
        banner.findOne({ _id: _id }, (err, data) => {
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
            else
            {
                res.json({
                    status: 'success',
                    message: 'successfully  banner is updated',
                    result: [data]
                })
            }
        })
    })
})

//*****************************************************
//Banner 2
//add banner2
router.post('/banner2_add', (req, res) => {
    banner2.find((error, data) => {
        // let recentDoc = data[data.length-1]
        // recentDoc = recentDoc.toObject()
        // let recentDocId = parseInt(recentDoc._id,10)
        // req.body._id = recentDocId +1
        var _id = data.length + 1
        req.body._id = _id
        banner2.create(req.body, (err, data) => {
            if (err) {
                res.json({
                    status: 'failed',
                    message: 'failed to display'
                })
            }
            else {
                return res.json({
                    status: 'success',
                    message: 'successfully  banner2 is added',
                    result: [data]
                })
            }
        })
    })
})

router.get('/banner2_get', (req, res) => {
    banner2.find(req.body, (err, data) => {
        if (err) {
            res.json({
                status: 'failed',
                message: 'failed to display'
            })
        }
        return res.json({
            status: 'success',
            message: 'successfully  banner2 is displayed',
            result: data
        })
    })
})

//***************************************************
//banner 3
//background image
router.post('/banner3_add', (req, res) => {
    banner3.find((error, data) => {
        // let recentDoc = data[data.length-1]
        // recentDoc = recentDoc.toObject()
        // let recentDocId = parseInt(recentDoc._id,10)
        // req.body._id = recentDocId +1
        var _id = data.length + 1
        req.body._id = _id
        banner3.create(req.body, (err, data) => {
            if (err) {
                res.json({
                    status: 'failed',
                    message: 'failed to display'
                })
            }
            else {
                return res.json({
                    status: 'success',
                    message: 'successfully  banner3 is added',
                    result: [data]
                })
            }
        })
    })
})

router.get('/banner3_get', (req, res) => {
    banner3.find(req.body, (err, data) => {
        if (err) {
            res.json({
                status: 'failed',
                message: 'failed to display'
            })
        }
        return res.json({
            status: 'success',
            message: 'successfully  banner3 is displayed',
            result: data
        })
    })
})

//*********************************************************
//offer banner 4

router.post('/banner4_add', (req, res) => {
    offer_banner4.find((error, data) => {
        // let recentDoc = data[data.length-1]
        // recentDoc = recentDoc.toObject()
        // let recentDocId = parseInt(recentDoc._id,10)
        // req.body._id = recentDocId +1
        var _id = data.length + 1
        req.body._id = _id
        offer_banner4.create(req.body, (err, data) => {
            if (err) {
                res.json({
                    status: 'failed',
                    message: 'failed to display'
                })
            }
            else {
                return res.json({
                    status: 'success',
                    message: 'successfully  offer_banner4 is added',
                    result: [data]
                })
            }
        })
    })
})

router.get('/banner4_get', (req, res) => {
    offer_banner4.find(req.body, (err, data) => {
        if (err) {
            res.json({
                status: 'failed',
                message: 'failed to display'
            })
        }
        return res.json({
            status: 'success',
            message: 'successfully  offer_banner4 is displayed',
            result: data
        })
    })
})

//******************************************************************************************* */
//banneradd5


router.post('/banner5_add', (req, res) => {
    banneradd.find((error, data) => {
        // let recentDoc = data[data.length-1]
        // recentDoc = recentDoc.toObject()
        // let recentDocId = parseInt(recentDoc._id,10)
        // req.body._id = recentDocId +1
        var _id = data.length + 1
        req.body._id = _id
        banneradd.create(req.body, (err, data) => {
            if (err) {
                res.json({
                    status: 'failed',
                    message: 'failed to display'
                })
            }
            else {
                return res.json({
                    status: 'success',
                    message: 'successfully  banneradd is added',
                    result: [data]
                })
            }
        })
    })
})

router.get('/banner5_get', (req, res) => {
    banneradd.find(req.body, (err, data) => {
        if (err) {
            res.json({
                status: 'failed',
                message: 'failed to display'
            })
        }
        return res.json({
            status: 'success',
            message: 'successfully  banneradd is displayed',
            result: data
        })
    })
})


//******************************************************************************************* */
//banneradd6 


router.post('/banner6_add', (req, res) => {
    bannershare.find((error, data) => {
        // let recentDoc = data[data.length-1]
        // recentDoc = recentDoc.toObject()
        // let recentDocId = parseInt(recentDoc._id,10)
        // req.body._id = recentDocId +1
        var _id = data.length + 1
        req.body._id = _id
        bannershare.create(req.body, (err, data) => {
            if (err) {
                res.json({
                    status: 'failed',
                    message: 'failed to display'
                })
            }
            else {
                return res.json({
                    status: 'success',
                    message: 'successfully  bannershare is added',
                    result: [data]
                })
            }
        })
    })
})

router.get('/banner6_get', (req, res) => {
    bannershare.find(req.body, (err, data) => {
        if (err) {
            res.json({
                status: 'failed',
                message: 'failed to display'
            })
        }
        return res.json({
            status: 'success',
            message: 'successfully  bannershare is displayed',
            result: data
        })
    })
})


module.exports=router