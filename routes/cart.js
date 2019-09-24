var express = require('express')
var cart = require('../models/cart')
var product = require('../models/product')
var product_skus = require('../models/product_sku')
var customer_table = require('../models/customer_table')
var router = express.Router()
router.post('/add_cart', async (req, res) => {
    var { _id_product, _id_sku, _id_customer, quantity, session_id } = req.body
    cart.find({ _id_product, _id_sku, _id_customer, session_id }, async (err, resdata) => {
        var totalcart_count = 1;
        var totalcart_count_remove = 1
        var totalcart_count_update = 1
        cart.find({ "_id_customer": req.body._id_customer, "session_id": req.body.session_id }, (err, cartdata) => {
            cartdata.forEach(finalsummarydata => {
                // console.log("finalsummarydata");
                // console.log(finalsummarydata.quantity);
                // console.log("finalsummarydata");
                totalcart_count = cartdata.length + 1;
                totalcart_count_update = cartdata.length
                totalcart_count_remove = cartdata.length - 1;
            });
        });
        if (err) { return res.json({ status: false, message: "failed" }) }
        else if (resdata.length === 0 && quantity !== 0) {
            // console.log(resdata);
            cart.find({}, async (err, data) => {
                if (data.length > 0) {
                    let recentDoc = data[data.length - 1]
                    recentDoc = recentDoc.toObject()
                    let recentDocId = parseInt(recentDoc._id, 10)
                    req.body._id = recentDocId + 1
                } else {
                    var _id = data.length + 1
                    req.body._id = _id
                }

                var p1 = new Promise((resolve, reject) => {
                    cart.create(req.body, async (err, data) => {
                        var skudata = []
                        var stock;
                        product_skus.find({}, (err, product_sku_data) => {
                            product_sku_data.forEach(skudata => {
                                p1.then(() => {
                                    console.log()
                                    if (err) {
                                        res.json({
                                            status: 'failed',
                                            message: 'failed to display'
                                        })
                                    } else {
                                        return res.json({
                                            status: 'success',
                                            message: 'successfully product is added',
                                            result: data,
                                            summary: totalcart_count

                                        })
                                    }

                                })
                            })
                        })
                    })
                })
            })
        }
        else {
            // console.log(data);
            resdata.forEach(getdataresult => {
                if (getdataresult._id_customer === _id_customer && getdataresult._id_product === _id_product && getdataresult._id_sku === _id_sku) {
                    // var getquantity = quantity + getdataresult.quantity
                    if (quantity != 0) {
                        cart.findOneAndUpdate({ _id_sku: getdataresult._id_sku, _id_product: getdataresult._id_product, _id_customer: getdataresult._id_customer }, { quantity: quantity }, (err, getdata) => {
                            cart.findOne({ _id_sku, _id_product, _id_customer }, (error, getdata) => {
                                return res.json({
                                    status: 'success',
                                    message: 'product updated to cart is successfully',
                                    result: getdata,
                                    // summary:  totalcart_count
                                    summary: totalcart_count_update
                                    // summary: totalcart_count
                                })
                            })
                        })

                    }
                    else {
                        cart.findOneAndDelete({ _id_sku, _id_product, _id_customer, session_id }, { quantity: 0 }, async (err, data) => {
                            // cart.findOneAndDelete(quantity, { quantity: 0 }, function (err, data) {
                            if (err) {
                                return res.json({
                                    status: 'failed ',
                                    message: 'Failed to delete',
                                })
                            } else {
                                // cart.findOne({ quantity: quantity }, (error, getdata) => {
                                return res.json({
                                    status: 'success',
                                    message: 'product cleared from cart',
                                    result: data,
                                    // summary:  totalcart_count
                                    summary: totalcart_count_remove
                                })
                                // })
                            }
                        });
                    }
                } else {
                    return res.json({
                        status: 'success',
                        message: 'No Data Found'
                    })
                }
            })
        }
    })
})

//14th ser
//cart list with customer id
router.get('/cart_list/:_id', function (req, res) {
    let requestid = parseInt(req.params._id);
    var cartdata_arr = [];
    var productdata_arr = [];
    var productskudata_arr = [];
    cart.find((err, cartdata) => {
        cartdata.forEach(cartdataresult => {
            // console.log("cartdataresult");
            // console.log(cartdataresult);
            // console.log("cartdataresult");
            let cartresultdoc = cartdataresult._doc;
            cartdata_arr.push({
                "id_customer": cartdataresult._doc._id_customer,
                "id_product": cartdataresult._doc._id_product,
                "id_sku": cartdataresult._doc._id_sku,
                "id_warehouse": cartdataresult._doc._id_warehouse,
                "quantity": cartdataresult._doc.quantity
            });
        })
    })

    console.log("cartdata_arr");
    console.log(cartdata_arr);
    console.log("cartdata_arr");
    product.find((err, productdata) => {
        productdata.forEach(productdataresult => {

            productdata_arr.push({
                "id": productdataresult._doc._id,
                "name": productdataresult._doc.name,
                "article_no": productdataresult._doc.article_no,
                "mrp": productdataresult._doc.mrp,
                "selling_price": productdataresult._doc.selling_price,
                "best_price": productdataresult._doc.best_price,
                "description": productdataresult._doc.description,
                "brand": productdataresult._doc.brand,
                "id_category": productdataresult._doc._id_category,
                "id_lowcategory": productdataresult._doc._id_category,
                "id_subcategory": productdataresult._doc._id_subcategory,
                "pic": productdataresult._doc.pic
            })
        })
        var quantity_data;
        product_skus.find((err, productskusdata) => {
            productskusdata.forEach(productskusdataresult => {
                productskudata_arr.push({
                    "id": productskusdataresult._doc._id,
                    "id_product": productskusdataresult._doc._id_product,
                    "size": productskusdataresult._doc.size,
                    "stock": productskusdataresult._doc.stock,
                    "mrp": productskusdataresult._doc.mrp,
                    "min_quantity": productskusdataresult._doc.min_quantity,
                    "max_quantity": productskusdataresult._doc.max_quantity,
                    "tax": productskusdataresult._doc.tax,
                    "selling_price": productskusdataresult._doc.selling_price,
                    "pic": productskusdataresult._doc.pic

                })
            })

            customer_table.find({ "_id": requestid }, (err, customerdata) => {

                var customer_table_data;
                var cart_table_data = [];
                var find_cust_details = [];
                var cart_product_details = [];
                var summary_arr_data = [];
                var managercartdetails = [];
                if (customerdata) {
                    if (err) { throw err; }

                    cartdata_arr.forEach(findcustdetails => {
                        if (findcustdetails.id_customer === requestid) {
                            let productid = findcustdetails.id_product;
                            let skudetails_id = findcustdetails.id_sku;
                            quantity_data = findcustdetails.quantity;

                            var cartproduct_detail = [];
                            productdata_arr.forEach(findproductdataarrdetails => {
                                if (findproductdataarrdetails.id === productid) {
                                    productskudata_arr.forEach(productskusdataresult => {
                                        if (productskusdataresult.id === skudetails_id) {

                                            cartproduct_detail.push({
                                                "id": productskusdataresult.id,
                                                "id_product": productskusdataresult.id_product,
                                                "size": productskusdataresult.size,
                                                "stock": productskusdataresult.stock,
                                                "mrp": productskusdataresult.mrp,
                                                "min_quantity": productskusdataresult.min_quantity,
                                                "max_quantity": productskusdataresult.max_quantity,
                                                "tax": productskusdataresult.tax,
                                                "selling_price": productskusdataresult.selling_price,
                                                "pic": productskusdataresult.pic,
                                                "mycart": quantity_data
                                            });
                                        }

                                    })
                                    cart_product_details.push({
                                        "id": findproductdataarrdetails.id,
                                        "name": findproductdataarrdetails.name,
                                        "article_no": findproductdataarrdetails.article_no,
                                        "mrp": findproductdataarrdetails.mrp,
                                        "selling_price": findproductdataarrdetails.selling_price,
                                        "best_price": findproductdataarrdetails.best_price,
                                        "description": findproductdataarrdetails.description,
                                        "brand": findproductdataarrdetails.brand,
                                        "id_category": findproductdataarrdetails.id_category,
                                        "id_lowcategory": findproductdataarrdetails.id_lowcategory,
                                        "id_subcategory": findproductdataarrdetails.id_subcategory,
                                        "pic": findproductdataarrdetails.pic,
                                        "sku": cartproduct_detail

                                    })

                                }
                            })
                        }
                    })
                }
                if (cart_product_details.length > 0) {
                    let final_summary_data = 0;
                    let final_cart_arr = [];

                    cart_product_details.forEach(cartproductdetailsdta => {
                        console.log(cartproductdetailsdta);
                        cartproductdetailsdta.sku.forEach(cartproductdetailsdata => {
                            // console.log(_id_product)
                            final_cart_arr.push({
                                "id": cartproductdetailsdata.id,
                                "id_product": cartproductdetailsdata.id_product,
                                "size": cartproductdetailsdata.size,
                                "stock": cartproductdetailsdata.stock,
                                "mrp": cartproductdetailsdata.mrp,
                                "min_quantity": cartproductdetailsdata.min_quantity,
                                "max_quantity": cartproductdetailsdata.max_quantity,
                                "tax": cartproductdetailsdata.tax,
                                "selling_price": cartproductdetailsdata.selling_price,
                                "pic": cartproductdetailsdata.pic
                            });
                        })
                    })
                    let mrpprice = 0;
                    let sellingprice = 0;
                    let deliverycharge = 50;
                    let grand_total;
                    final_cart_arr.forEach(finalsummarydata => {
                        console.log(quantity_data);
                        mrpprice = (parseInt(mrpprice) + parseInt(finalsummarydata.mrp));
                        sellingprice = (parseInt(sellingprice) + parseInt(finalsummarydata.selling_price))
                        grand_total = (parseInt(deliverycharge) + parseInt(sellingprice) * quantity_data);
                        // grand_total = (parseInt(deliverycharge) + quantity_data * parseInt(sellingprice));
                    });

                    summary_arr_data.push({
                        "cart_count": final_cart_arr.length,
                        "realization": "0",
                        "mrp": mrpprice,
                        "selling_price": sellingprice,
                        "delivery_charge": deliverycharge,
                        "grand_total": grand_total
                    })

                    res.send({
                        "status": "success",
                        "message": "Get Successfully",
                        "result": cart_product_details,
                        "summary": summary_arr_data
                        // "Summary": 
                    });
                }
                else {
                    res.send({
                        status: "success",
                        message: "No data found",
                        "result": [],
                        "summary": []
                        // "status": "success",
                        // "message": "No data found"
                        // "Summary": 
                    });
                }
            })
        })
    })
})

//...................................................

//sessionid and id cart list
//searchBy_id
//18th
router.post('/1414cart_list', async (req, res) => {
    let requestid = req.body._id;
    var session_id = req.body.session_id;
    console.log(requestid);


    var productskudata_arr = [];
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
        await cart.find({ "_id_customer": requestid }, (err, cartdata) => {

            cartdata.forEach(cartdataresult => {
                cartdata_arr.push(cartdataresult);
            });

        })
    }


    await product_skus.find((err, productskusgetdata) => {
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

    await product.find((err, productdata) => {
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
                                // "quantity": quantity_data
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
                                // "quantity": quantity_data
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
                        "brand": productdatares_arr.brand,
                        "pic": productdatares_arr.pic,
                        "sku": skudata_arr
                    });
                }

            })
        })
        // console.log(skudata_arr);
        var summary_arr_data = [];
        let mrpprice = 0;
        let sellingprice = 0;
        let deliverycharge = 0;
        let grand_total;
        final_cart_arr.forEach(finalsummarydata => {
            console.log(quantity_data);
            mrpprice = (parseInt(mrpprice) + parseInt(finalsummarydata.mrp));
            sellingprice = (parseInt(sellingprice) + parseInt(finalsummarydata.selling_price))
            grand_total = (parseInt(deliverycharge) + quantity_data * parseInt(sellingprice));
        });

        summary_arr_data.push({
            "cart_count": final_cart_arr.length,
            "realization": "0",
            "mrp": mrpprice,
            "selling_price": sellingprice,
            "delivery_charge": deliverycharge,
            "grand_total": grand_total
        })

        res.send({
            "status": "success",
            "message": "Get Successfully",
            // "data": product_skus_res,
            "result": productdata_arr,
            "summary": summary_arr_data


        });

    });


})




//21212121
//sessionid and id cart list
//searchBy_id
router.post('/cart_list', async (req, res) => {
    let requestid = req.body._id;
    var session_id = req.body.session_id;
    console.log(requestid);


    var productskudata_arr = [];
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
        await cart.find({ "_id_customer": requestid }, (err, cartdata) => {

            cartdata.forEach(cartdataresult => {
                cartdata_arr.push(cartdataresult);
            });

        })
    }


    await product_skus.find((err, productskusgetdata) => {
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

    await product.find((err, productdata) => {
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
                        "brand": productdatares_arr.brand,
                        "pic": productdatares_arr.pic,
                        "sku": skudata_arr
                    });
                }

            })
        })
        // console.log(skudata_arr);
        var summary_arr_data = [];
        let mrpprice = 0;
        let sellingprice = 0;
        let deliverycharge = 50;
        let grand_total;
        final_cart_arr.forEach(finalsummarydata => {
            console.log(quantity_data);
            mrpprice = (parseInt(mrpprice) + ((finalsummarydata.mycart) * parseInt(finalsummarydata.mrp)));
            // sellingprice = (parseInt(sellingprice) + parseInt(finalsummarydata.selling_price))
            sellingprice = (parseInt(sellingprice) + ((finalsummarydata.mycart) * parseInt(finalsummarydata.selling_price)))
            grand_total = (parseInt(sellingprice));
        });
        console.log(grand_total);
        summary_arr_data.push({
            "cart_count": final_cart_arr.length,
            "realization": "0",
            "mrp": mrpprice,
            "selling_price": sellingprice,
            "delivery_charge": deliverycharge,
            "grand_total": (parseInt(deliverycharge) + grand_total)
        })

        res.send({
            "status": "success",
            "message": "Get Successfully",
            // "data": product_skus_res,
            "result": productdata_arr,
            "summary": summary_arr_data


        });

    });


})



//22nd 





router.post('/map', async (req, res, next) => {
    let { session_id, _id_sku } = req.body
    var _id_customer = req.body._id_customer
    await cart.find(_id_customer, (err, data) => {
        if (_id_customer !== 0) {

            cart.updateMany({ session_id }, { $set: { _id_customer: _id_customer } }, (err, data) => {
                // if(session_id==req.body.session_id){

                // cart.findOne({ _id_customer}, (err, data) => {
                if (err) console.log(err)
                else {
                    res.json({
                        status: 'success',
                        message: 'successfully maped'
                        //  data
                    })
                }
                // })
            })
            // }


        }
        else {
            res.json("err")
        }
    })



})

router.post('/1111delete', function (req, res) {
    let { _id_customer } = req.body
    cart.deleteMany({ _id_customer }, function (err, data) {

        if (err) {
            res.json({
                status: 'failed',
                message: 'failed to display'
            })
        }
        else
            res.json({
                status: 'success',
                message: 'sucessfully  cart is empty',

            });


    })

})




router.post('/delete', (req, res) => {
    let { session_id, _id_customer } = req.body

    if (session_id) {
        cart.deleteMany({ session_id }, (err, productcartdata) => {
            if (productcartdata.n === 0) {
                res.json({
                    status: "failed",
                    message: 'No data',
                })
            } else {
                res.json({
                    status: 'success',
                    message: 'sucessfully  cart is empty....!',

                })
            }
        });
    }
    else if (_id_customer) {
        cart.deleteMany({ _id_customer }, (err, productcartdata) => {
            if (productcartdata.n === 0) {
                res.json({
                    status: "failed",
                    message: 'No data',
                })
            } else {
                res.json({
                    status: 'success',
                    message: 'sucessfully  cart is empty',
                })
            }
        });
    }


})




//session delete
router.post('/delete_session', function (req, res) {
    let { session_id } = req.body
    cart.deleteMany({ session_id }, function (err, data) {

        if (err) {
            res.json({
                status: 'failed',
                message: 'failed to display'
            })
        }
        else
            res.json({
                status: 'success',
                message: 'sucessfully  cart is empty',

            });


    })

})

//..........................................................................................


router.post('/add_cart_tapu', (req, res) => {

    var { _id_product, _id_sku, _id_customer, quantity } = req.body

    cart.find({ _id_product }, (err, data) => {
        if (err) return res.json({ status: false, message: "failed" })
        if (!data) {
            res.json({ status: 'failed' })
        } else {
            console.log(data);
            data.forEach(getdataresult => {
                if (getdataresult._id_customer === _id_customer && getdataresult._id_product === _id_product && getdataresult._id_sku === _id_sku) {
                    // var getquantity = quantity + getdataresult.quantity
                    cart.update({ _id_product: getdataresult._id_product }, { $set: { quantity: quantity } }, { multi: true }, (err, getdata) => {
                        console.log(getdata);
                    })
                }
            })
            return res.json({
                status: 'success',
                message: 'product added to cart is successfully',
                result: data
            })

        }



    })
})



module.exports = router