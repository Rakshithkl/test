var express = require('express')
var categories = require('../models/category')
var sub_categories = require('../models/sub_category')
var product=require('../models/product')
var low_category = require('../models/low_category')
var product_skus=require('../models/product_sku')

var cart = require('../models/cart')
var router = express.Router()


router.post('/searchBy_category_name', function (req, res) {
    // var {name,product} = req.body
    // var input = 'ln';
    var regexp = new RegExp("^"+ req.body.name);
     product.find({ name : { '$regex' : req.body.name, '$options' : 'i' } }, (err, data) => {
    // product.find({name: new RegExp(input, "i")},(err,data)=>{

   
    // categories.find({ 'name': new RegExp(name, 'i') }, (err, data) => {
        // categories.find({ name: {$regex:/^a/,$option:'i'} }, (err, data) => {
        // categories.find({name:{$regex: "^g",$options:'i'}} , (err, data) => {
        // categories.find({name:{$regex:name,$options:'i'}} , (err, data) => {

        if (err) {
            res.json({
                status: 'failed',
                message: 'failed to display'
            })
        }
        else if (!data) {
            res.json({
                status: "failed",
                message: "No data "
            })
        }
        else
            return res.json({
                status: 'success',
                message: 'successfully  category is displayed',
                result: data
            })
    })
})




//....
//summary ...cart data result
router.post('/15_category_subcategory_getall', async (req, res) => {
    var resultcatdata = [];
    var { _id_customer, _id_lowcategory, session_id } = req.body
    var sub_getdata;
    var low_getcategory = [];
    var cart_count_data =[]
    var productcartdata_arr = [];
    var productdata_arr = [];
    var cartdata_arr = [];   
    var product_skus_res = [];

    if (session_id) {
        await cart.find({ "session_id": session_id }, (err, cartdata) => {
 
             cartdata.forEach(cartdataresult => {
                 cartdata_arr.push(cartdataresult);
             });
 
         })
     } else {
         await  cart.find({ "_id_customer": _id_customer }, (err, cartdata) => {
 
             cartdata.forEach(cartdataresult => {
                 cartdata_arr.push(cartdataresult);
             });
 
         })
     }
 
    await sub_categories.find((err, sub_data) => {
        sub_getdata = sub_data;
    });
    await low_category.find((err, low_data) => {
        low_getcategory = low_data;
    });
    await categories.find((err, cat_data) => {
        if (err) {
            res.send({
                status: 'failed',
                message: 'failed to display'

            });
        }

        else if (!cat_data) {
            res.send({
                status: "success",
                message: "No data found",
            });
        }
        else {

            cat_data.forEach(cat_data_result => {
                var resultdata = [];
                sub_getdata.forEach(sub_getdata_result => {
                    var resultlowdata = [];

                    if (sub_getdata_result._id_category === cat_data_result._id) {
                        resultdata.push({
                            "_id": sub_getdata_result._id,
                            "name": sub_getdata_result.name,
                            "_id_category": sub_getdata_result._id_category,
                            "pic": sub_getdata_result.pic,
                            "description": sub_getdata_result.description,
                            "createBy": sub_getdata_result.createBy,
                            "low_getdata_result": resultlowdata
                        });
                    }
                    low_getcategory.forEach(low_getdata_result => {
                        if (low_getdata_result._id_subcategory === sub_getdata_result._id) {
                            resultlowdata.push({
                                "_id": low_getdata_result._id,
                                "name": low_getdata_result.name,
                                "_id_subcategory": low_getdata_result._id_subcategory,
                                "pic": low_getdata_result.pic,
                                "description": low_getdata_result.description,
                                "createBy": low_getdata_result.createBy
                            });
                        }
                    })
                })
                
                resultcatdata.push({
                    "_id": cat_data_result._id,
                    "name": cat_data_result.name,
                    "pic": cat_data_result.pic,
                    "description": cat_data_result.description,
                    "createBy": cat_data_result.createBy,
                    "sub_cat_data": resultdata
                });
            })

        }

        
    product_skus.find((err, productskusgetdata) => {
    productskusgetdata.forEach(productskusdata => {
        product_skus_res.push({
            "id": productskusdata._id,
            "_id_product": productskusdata._id_product,
            "size": productskusdata.size,
            "stock": productskusdata.stock,
            "mrp": productskusdata.mrp,
            "min_quantity": productskusdata.min_quantity,
            "max_quantity": productskusdata.max_quantity,
            "tax": productskusdata.tax,
            "selling_price": productskusdata.selling_price,
            "pic": productskusdata.pic
        });
    })
})

var quantity_data;
var final_cart_arr = [];

 product.find((err, productdata) => {
    cartdata_arr.forEach(getproduct_id => {
        console.log(getproduct_id);
        var skudata_arr = [];

        productdata.forEach(productdatares_arr => {
            console.log(productdatares_arr);
            if (getproduct_id._id_product === productdatares_arr._id) {
                product_skus_res.forEach(productskures_arr => {
                    if (getproduct_id._id_product === productskures_arr._id_product && getproduct_id._id_sku === productskures_arr.id) {
                        console.log(productskures_arr);
                        quantity_data = getproduct_id.quantity;
                        skudata_arr.push({
                            "id": productskures_arr.id,
                            "id_product": productskures_arr._id_product,
                            "size": productskures_arr.size,
                            "stock": productskures_arr.stock,
                            "mrp": productskures_arr.mrp,
                            "min_quantity": productskures_arr.min_quantity,
                            "max_quantity": productskures_arr.max_quantity,
                            "tax": productskures_arr.tax,
                            "selling_price": productskures_arr.selling_price,
                            "pic": productskures_arr.pic,
                            "mycart": quantity_data
                        });
                        final_cart_arr.push({
                            "id": productskures_arr.id,
                            "_id_product": productskures_arr._id_product,
                            "size": productskures_arr.size,
                            "stock": productskures_arr.stock,
                            "mrp": productskures_arr.mrp,
                            "min_quantity": productskures_arr.min_quantity,
                            "max_quantity": productskures_arr.max_quantity,
                            "tax": productskures_arr.tax,
                            "selling_price": productskures_arr.selling_price,
                            "pic": productskures_arr.pic,
                            "mycart": quantity_data
                        });
                    }
                })

                productdata_arr.push({
                    "id": productdatares_arr._id,
                    "id_category": productdatares_arr._id_category,
                    "id_subcategory": productdatares_arr._id_subcategory,
                    "id_lowcategory": productdatares_arr._id_lowcategory,
                    "name": productdatares_arr.name,
                    "article_no": productdatares_arr.article_no,
                    "mrp": productdatares_arr.mrp,
                    "selling_price": productdatares_arr.selling_price,
                    "best_price": productdatares_arr.best_price,
                    "description": productdatares_arr.description,
                    "brand":productdatares_arr.brand,
                    "pic":productdatares_arr.pic,
                    "sku": skudata_arr
                });
            }

        })
    })
        var summary_arr_data = [];
        let mrpprice = 0;
        let sellingprice = 0;
        let deliverycharge = 50;
        let grand_total;
        final_cart_arr.forEach(finalsummarydata => {
            console.log(quantity_data);
            mrpprice = (parseInt(mrpprice) +((finalsummarydata.mycart)* parseInt(finalsummarydata.mrp)));
            // sellingprice = (parseInt(sellingprice) + parseInt(finalsummarydata.selling_price))
             sellingprice = (parseInt(sellingprice) +((finalsummarydata.mycart)* parseInt(finalsummarydata.selling_price))) 
            grand_total = (parseInt(sellingprice));
        });
            console.log(grand_total);
        summary_arr_data.push({
            "cart_count": final_cart_arr.length,
            "realization": "0",
            "mrp": mrpprice,
            "selling_price": sellingprice,
            "delivery_charge": deliverycharge,
            "grand_total": (parseInt(deliverycharge)+grand_total)
        })


        res.send({
            "status": "success",
            "message": "Get Successfully",
            "category": resultcatdata,
            "summary": summary_arr_data


        });
    })

})
})
//.....


//20th ...
router.get('/category_subcategory_getall', async (req, res) => {
    var resultcatdata = [];
    var sub_getdata;
    var low_getcategory = [];
    var cart_count_data =[]
    var productcartdata_arr = [];

    await cart.find({  }, (err, productcartdata) => {
        productcartdata.forEach(productcartdata_res => {
            // console.log(productcartdata_res);
            productcartdata_arr.push(
                {
                    "id": productcartdata_res._id,
                    "id_customer": productcartdata_res._id_customer,
                    "id_product": productcartdata_res._id_product,
                    "id_sku": productcartdata_res._id_sku,
                    "id_warehouse": productcartdata_res._id_warehouse,
                    "quantity": productcartdata_res.quantity,
                    "session_id": productcartdata_res.session_id
                }
            );
            cart_count_data = productcartdata.length;
        })
    });

    await sub_categories.find((err, sub_data) => {
        sub_getdata = sub_data;
    });
    await low_category.find((err, low_data) => {
        low_getcategory = low_data;
    });
    await categories.find((err, cat_data) => {
        if (err) {
            res.send({
                status: 'failed',
                message: 'failed to display'

            });
        }

        else if (!cat_data) {
            res.send({
                status: "success",
                message: "No data found",

                // summary: summary_arr_data
                // "Summary": 
            });
        }
        else {

            cat_data.forEach(cat_data_result => {
                var resultdata = [];
                sub_getdata.forEach(sub_getdata_result => {
                    var resultlowdata = [];

                    if (sub_getdata_result._id_category === cat_data_result._id) {
                        resultdata.push({
                            "_id": sub_getdata_result._id,
                            "name": sub_getdata_result.name,
                            "_id_category": sub_getdata_result._id_category,
                            "pic": sub_getdata_result.pic,
                            "description": sub_getdata_result.description,
                            "createBy": sub_getdata_result.createBy,
                            "low_getdata_result": resultlowdata
                        });
                    }
                    low_getcategory.forEach(low_getdata_result => {
                        if (low_getdata_result._id_subcategory === sub_getdata_result._id) {
                            resultlowdata.push({
                                "_id": low_getdata_result._id,
                                "name": low_getdata_result.name,
                                "_id_subcategory": low_getdata_result._id_subcategory,
                                "pic": low_getdata_result.pic,
                                "description": low_getdata_result.description,
                                "createBy": low_getdata_result.createBy
                            });
                        }
                    })
                })
                resultcatdata.push({
                    "_id": cat_data_result._id,
                    "name": cat_data_result.name,
                    "pic": cat_data_result.pic,
                    "description": cat_data_result.description,
                    "createBy": cat_data_result.createBy,
                    "sub_cat_data": resultdata
                });
            })

        }

      
        let mycartdata = cart_count_data;
        res.send({
            "status": "success",
            "message": "Get Successfully",
            "category": resultcatdata,
            // "summ":mycartdata
            // "cart_count": mycartdata,


        });
    })

})




//view by category and subcategory,lowest catg id
router.post('/category_sub_low', function (req, res) {
    let { _id: _id } = req.body
    categories.findOne({ _id }, (err, data) => {
        categories.aggregate([
            {

                $lookup:
                {
                    from: "sub_categories",
                    localField: "_id",
                    foreignField: "_id_category",
                    as: "sub_categories",
                }
            },

            {
                $unwind: "$sub_categories"
            },

            {
                $lookup:
                {
                    from: "low_categories",
                    localField: "_id",
                    foreignField: "_id_subcategory",
                    as: "Lowest_sub_categories",
                }
            },

        ], function (err, result) {
            if (err) {
                res.send('Please contact admin');
            } else {
                res.send({
                    "Status": "success",
                    "message": "Get Successfully",
                    "category": result,

                });
            }

        });
    })
})
//*************************** */category_APIS***********************************************
router.post('/add', (req, res) => {
    categories.find((error, data) => {

        // let recentDoc = data[data.length-1]
        // recentDoc = recentDoc.toObject()
        // let recentDocId = parseInt(recentDoc._id,10)
        // req.body._id = recentDocId +1

        // var _id = data.length + 1
        // req.body._id = _id
        if (data.length > 0) {

            let recentDoc = data[data.length - 1]
            recentDoc = recentDoc.toObject()
            let recentDocId = parseInt(recentDoc._id, 10)
            req.body._id = recentDocId + 1
        } else {
            var _id = data.length + 1
            req.body._id = _id
        }


        categories.create(req.body, (err, data) => {

            if (err) {
                res.json({
                    status: 'failed',
                    message: 'failed to display'
                })
            }
            // else if (!data) {
            //     res.json({
            //         status: "failed",
            //         message: "No data"
            //     })
            // }
            else {
                return res.json({
                    status: 'success',
                    message: 'successfully  category is added',
                    result: [data]
                })
            }
        })
    })
})


router.get('/get', (req, res) => {

    var parent = req.body
    categories.find({ parent: "0" }, (err, data) => {
        // category.find(req.params, (err, data) => {
        if (err) {
            res.json({
                status: 'failed',
                message: 'failed to display'
            })
        }
        return res.json({
            status: 'success',
            message: 'successfully  category is displayed',
            result: data
        })
    })
})


router.post('/delete', function (req, res) {
    let _id=req.body
 
    let { _id_category} = req.body
    _id=_id_category
    categories.deleteMany({ _id}, function (err, data) {
        sub_categories.deleteMany({ _id_category}, function (err, data) {
            low_category.deleteMany({ _id_category}, function (err, data) {
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
            message: 'sucessfully category is deleted',
            result: [data]
        });
    })
   
})
    })
})



router.post('/edit', (req, res, next) => {
    let { _id } = req.body
    categories.findOneAndUpdate({ _id }, req.body, (err, data) => {
        categories.findOne({ _id: _id }, (err, data) => {

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
                    message: 'successfully  category is updated',
                    data
                })
            }
        })
    })
})


//parent
router.post('/getsubcategory/view', function (req, res) {
    let { _id_category: _id_category } = req.body
    sub_categories.find({ _id_category }, (err, data) => {
        if (err) {
            res.json({
                status: 'failed',
                message: 'failed to display'
            })
        }
        else if (!data) {
            res.json({
                status: "failed",
                message: "No data "
            })
        }
        else
            return res.json({
                status: 'success',
                message: 'successfully  sub_category is displayed',
                result: data
            })
    })
})
//********************************************************************************************** */


//view by category name
  





//view by category id
router.post('/searchBy_category_id', function (req, res) {
    let { _id: _id } = req.body
    categories.findOne({ _id }, (err, data) => {
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
            return res.json({
                status: 'success',
                message: 'successfully  category is displayed',
                result: data
            })
        }
    })
})

//###################################################################
//subcategory APIS

router.post('/sub_add', (req, res) => {
    sub_categories.find((error, data) => {

        // let recentDoc = data[data.length - 1]
        // recentDoc = recentDoc.toObject()
        // let recentDocId = parseInt(recentDoc._id, 10)
        // req.body._id = recentDocId + 1

        // var _id = data.length + 1
        // req.body._id = _id
        if (data.length > 0) {

            let recentDoc = data[data.length - 1]
            recentDoc = recentDoc.toObject()
            let recentDocId = parseInt(recentDoc._id, 10)
            req.body._id = recentDocId + 1
        } else {
            var _id = data.length + 1
            req.body._id = _id
        }



        sub_categories.create(req.body, (err, data) => {

            if (err) {
                res.json({
                    status: 'failed',
                    message: 'failed to display'
                })
            }
            // else if (!data) {
            //     res.json({
            //         status: "failed",
            //         message: "No data"
            //     })
            // }
            else {
                return res.json({
                    status: 'success',
                    message: 'successfully  sub_category is added',
                    result: [data]
                })
            }
        })
    })
})

router.post('/sub_view', function (req, res) {
    let { _id } = req.body
    sub_categories.findOne({ _id }, (err, data) => {
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
            return res.json({
                status: 'success',
                message: 'successfully  sub_category is displayed',
                result: data
            })

    })
})



router.post('/sub_delete', function (req, res) {
    let _id = req.body

    let { _id_subcategory } = req.body
    _id = _id_subcategory
    // categories.deleteMany({ _id }, function (err, data) {
        sub_categories.deleteMany({ _id }, function (err, data) {
            low_category.deleteMany({ _id_subcategory }, function (err, data) {
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
                    message: 'sucessfully  sub_category is deleted',
                    // result: [data]
                });
            })

        })
    })
// })


// router.post('/sub_delete', function (req, res) {
//     let { _id } = req.body
//     sub_categories.findOneAndDelete({ _id }, function (err, data) {

//         if (err) {
//             res.json({
//                 status: 'failed',
//                 message: 'failed to display'
//             })
//         }
//         else if (!data) {
//             res.json({
//                 status: "failed",
//                 message: "No data"
//             })
//         }
//         else
//             res.json({
//                 status: 'success',
//                 message: 'sucessfully  sub_category is deleted',
//                 result: data
//             });


//     })

// })

router.get('/sub_get', (req, res) => {

    sub_categories.find((err, data) => {
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
            return res.json({
                status: 'success',
                message: 'successfully  sub_category is displayed',
                result: data
            })
        }
    })
})

router.post('/sub_edit', (req, res, next) => {
    let { _id } = req.body
    sub_categories.findOneAndUpdate({ _id }, req.body, (err, data) => {
        sub_categories.findOne({ _id }, (err, data) => {

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
                    status: 'Success',
                    message: 'successfully  sub_category is updated',
                    data
                })
            }
        })
    })
})


//**************************************************************************************************************
//lowest category................
router.post('/low_add', (req, res) => {
    low_category.find((error, data) => {

        // let recentDoc = data[data.length-1]
        // recentDoc = recentDoc.toObject()
        // let recentDocId = parseInt(recentDoc._id,10)
        // req.body._id = recentDocId +1

        // var _id = data.length + 1
        // req.body._id = _id
        
        if (data.length > 0) {

            let recentDoc = data[data.length - 1]
            recentDoc = recentDoc.toObject()
            let recentDocId = parseInt(recentDoc._id, 10)
            req.body._id = recentDocId + 1
        } else {
            var _id = data.length + 1
            req.body._id = _id
        }


        low_category.create(req.body, (err, data) => {

            if (err) {
                res.json({
                    status: 'failed',
                    message: 'failed to display'
                })
            }
            else {
                return res.json({
                    status: 'success',
                    message: 'successfully  lowest_category is added',
                    result: [data]
                })
            }
        })
    })
})

router.post('/low_view', function (req, res) {
    let { _id } = req.body
    low_category.findOne({ _id }, (err, data) => {
        // low_category.find({ _id_subcategory :_id_subcategory}, (err, data) => {
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
                message: 'successfully  low_category is displayed base on subcategory',
                result: data
            })
        }

    })
})



//lowest category
router.post('/getlowcategory/view', function (req, res) {
    let { _id_subcategory: _id_subcategory } = req.body
    low_category.find({ _id_subcategory }, (err, data) => {
        if (err) {
            res.json({
                status: 'failed',
                message: 'failed to display'
            })
        }
        else if (!data) {
            res.json({
                status: "failed",
                message: "No data "
            })
        }
        else
            return res.json({
                status: 'success',
                message: 'successfully  low_category is displayed',
                result: data
            })
    })
})


router.post('/low_edit', (req, res, next) => {
    let { _id } = req.body
    low_category.findOneAndUpdate({ _id }, req.body, (err, data) => {
        low_category.findOne({ _id }, (err, data) => {

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
                res.json({
                    status: 'success',
                    message: 'successfully  low_category is updated',
                    data
                })

        })
    })
})
// })

router.get('/low_get', (req, res) => {
    low_category.find((err, data) => {
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
            return res.json({
                status: 'success',
                message: 'successfully  low_category is displayed',
                result: data
            })
        }
    })
})


router.post('/low_delete', function (req, res) {
    let { _id } = req.body
    low_category.findOneAndDelete({ _id }, function (err, data) {
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
            res.json({
                status: 'success',
                message: 'sucessfully  low_category is deleted',
                result: data
            });
    })

})


//parent
router.post('/zzzgetlowcategory/view', function (req, res) {
    let { _id_subcategory: _id_subcategory } = req.body
    low_category.find({ _id_subcategory }, (err, data) => {
        if (err) {
            res.json({
                status: 'failed',
                message: 'failed to display'
            })
        }
        else if (!data) {
            res.json({
                status: "failed",
                message: "No data "
            })
        }
        else
            return res.json({
                status: 'success',
                message: 'successfully  low_category is displayed',
                result: data
            })
    })
})


module.exports = router



