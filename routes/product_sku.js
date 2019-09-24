var express = require('express')
var product_sku = require('../models//product_sku')
var product = require('../models/product')
// var category = require('../models/category')
var router = express.Router()



router.post('/product_sku', function (req, res) {
    product.aggregate([
        {
            $lookup:
            {
                from: "product_skus",
                localField: "_id",
                foreignField: "_id_product",
                as: "sku",
            },
        },
    ],
        function (err, result) {
            if (err) {
                res.send('Please contact admin');
            } else {
                res.send({
                    "Status": "success",
                    "message": "Get Successfully",
                    "product": result,

                });
            }
        });
})

router.post('/add', (req, res) => {
    product_sku.find((error, allproduct) => {
        var _id = allproduct.length + 1
        req.body._id = _id
        var sku=req.body

        var sku = allproduct.length + 1
        req.body.sku = "1000000" + sku

        product_sku.create(req.body, (err, data) => {

            product_sku.findOneAndUpdate(req.body, { sku }, (err, data) => {
                if (err) {
                    res.json({
                        status: 'failed',
                        message: 'failed to display'
                    })
                } else {
                    return res.json({
                        status: 'success',
                        message: 'successfully  product_sku is added',
                        result: [data]
                    })
                }
            })
        })
    })
})


router.post('/delete', function (req, res) {
    let { _id } = req.body

    product_sku.findOneAndDelete({ _id }, function (err, data) {
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
        } else {
            res.json({
                status: 'success',
                message: 'sucessfully  product_sku is deleted',
                result: data
            });
        }
    })
})

router.get('/get', (req, res) => {
  
    product_sku.find((err, data) => {
        if (err) {
            res.json({
                status: 'failed',
                message: 'failed to display'
            })
        }
        return res.json({
            status: 'success',
            message: 'successfully  product_sku is displayed',
            result: data
        })
    })
})



router.post('/edit', (req, res, next) => {
    let { _id } = req.body
    product_sku.findOneAndUpdate({ _id }, req.body, (err, data) => {
        product_sku.findOne({ _id: _id }, (err, data) => {

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
                    message: 'successfully  product_sku  is updated',
                    data
                })
            }
        })
    })
})


//view by category id
router.post('/view', function (req, res) {
    let { _id: _id } = req.body
    product_sku.find({ _id }, (err, data) => {
        if (err) {
            res.json({
                status: 'failed',
                message: 'failed to display'
            })
        }
        return res.json({
            status: 'success',
            message: 'successfully  product_sku is displayed',
            result: [data]
        })
    })
})

module.exports = router



