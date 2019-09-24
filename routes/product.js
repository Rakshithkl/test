var express = require('express')
var product = require('../models/product')
var category = require('../models/category')
var product_sku = require('../models/product_sku')
var cart = require('../models/cart')
var router = express.Router()

router.post('/product_view_Onlowcat', async (req, res) => {
    var product_sku_arr = [];
    var productcartdata_arr = [];
    let final_cart_arr = [];
    var summary_arr_data = [];
    var { _id_customer, _id_lowcategory, session_id } = req.body
    var cart_count_data = 0;
    if (session_id) {
        await cart.find({ "session_id": session_id }, (err, productcartdata) => {
            var bar = new Promise((resolve, reject) => {
                productcartdata.forEach(productcartdata_res => {
                    // console.log(productcartdata_res._id_product)
                    product.find({}, (err, productrak) => {
                        productrak.forEach(productranju => {
                            // console.log(productranju._id_lowcategory)
                            console.log(productranju.quantity);
                            bar.then(() => {
                                if (productcartdata_res._id_product === productranju._id_lowcategory && productranju.quantity === 0) {

                                    if (err) {
                                        reject(err);

                                    } else {
                                        resolve(res.json({
                                            Result: "Out of Stock"
                                        }));
                                    }

                                }
                            })
                        })
                                // console.log("all done")
                                // })
                            })

                        })
                cart_count_data = productcartdata.length;
            })
        });
    } else {
        await cart.find({ "_id_customer": _id_customer }, (err, productcartdata) => {
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
    }
    console.log(cart_count_data);
    await product_sku.find(async (err, productskusdata) => {
        // console.log(productskusdata);
        await productskusdata.forEach(productskusdata => {
            product_sku_arr.push({
                "id": productskusdata._id,
                "id_product": productskusdata._id_product,
                "size": productskusdata.size,
                "stock": productskusdata.stock,
                "mrp": productskusdata.mrp,
                "min_quantity": productskusdata.min_quantity,
                "max_quantity": productskusdata.max_quantity,
                "tax": productskusdata.tax,
                "selling_price": productskusdata.selling_price,
                "warehouse_id":productskusdata.warehouse_id,
                "pic": productskusdata.pic
            });
        })
    });
    // let { id_lowcategory: id_lowcategory } = req.body;

    await product.find({ _id_lowcategory }, (err, data) => {


        let final_productdata = [];

        // console.log(data._doc);
        data.forEach(finalproductdat => {
            var final_sku_res = [];

            // console.log(final_sku_res);
            final_productdata.push({
                "id": finalproductdat._id,
                "id_category": finalproductdat._id_category,
                "id_subcategory": finalproductdat._id_subcategory,
                "id_lowcategory": finalproductdat._id_lowcategory,
                "name": finalproductdat.name,
                "article_no": finalproductdat.article_no,
                "mrp": finalproductdat.mrp,
                "selling_price": finalproductdat.selling_price,
                "best_price": finalproductdat.best_price,
                "description": finalproductdat.description,
                "brand": finalproductdat.brand,
                "pic": finalproductdat.pic,
                "sku": final_sku_res
            });

            product_sku_arr.forEach(finalskures => {
                console.log("finalskures");
                console.log(finalskures);
                console.log("finalskures");


                if (finalproductdat._id === finalskures.id_product) {
                    var mycart_res_data;
                    productcartdata_arr.forEach(productcartdata_arr_res => {
                        console.log("productcartdata_arr_res");
                        console.log(finalskures);
                        console.log("productcartdata_arr_res");
                        if (finalskures.id === productcartdata_arr_res.id_sku) {
                            console.log("hi");
                            console.log(productcartdata_arr_res.quantity);
                            if (productcartdata_arr_res.quantity) {
                                mycart_res_data = productcartdata_arr_res.quantity;
                            } else {
                                mycart_res_data = 0;
                            }
                        }
                    });
                    final_sku_res.push({
                        "id": finalskures.id,
                        "id_product": finalskures.id_product,
                        "size": finalskures.size,
                        "stock": finalskures.stock,
                        "mrp": finalskures.mrp,
                        "min_quantity": finalskures.min_quantity,
                        "max_quantity": finalskures.max_quantity,
                        "tax": finalskures.tax,
                        "selling_price": finalskures.selling_price,
                        "pic": finalskures.pic,
                        "product_name":finalproductdat.name,
                        "warehouse_id":finalskures.warehouse_id,
                        "mycart": mycart_res_data || 0
                    })
                    final_cart_arr.push({
                        "id": finalskures.id,
                        "id_product": finalskures.id_product,
                        "size": finalskures.size,
                        "stock": finalskures.stock,
                        "mrp": finalskures.mrp,
                        "min_quantity": finalskures.min_quantity,
                        "max_quantity": finalskures.max_quantity,
                        "tax": finalskures.tax,
                        "selling_price": finalskures.selling_price,
                        "pic": finalskures.pic,
                        "product_name":finalproductdat.name,
                        "warehouse_id":finalskures.warehouse_id,
                        "mycart": mycart_res_data || 0
                    })

                }


            })
        })


        let mrpprice = 0;
        let sellingprice = 0;
        let deliverycharge = 50;
        // let mycartdata = 0;
        let grand_total = 0;
        let mycartdata = cart_count_data;
        final_cart_arr.forEach(finalsummarydata => {
            console.log(finalsummarydata);
            // mycartdata = (parseInt(mycartdata) + parseInt(finalsummarydata.mycart));

            if (finalsummarydata.mycart > 0) {

                mrpprice = (parseInt(mrpprice) + parseInt(finalsummarydata.mrp));
                sellingprice = (parseInt(sellingprice) + parseInt(finalsummarydata.selling_price))
                grand_total = grand_total + (parseInt(finalsummarydata.mycart) * parseInt(finalsummarydata.selling_price));
            }

        });
        grand_total = grand_total + parseInt(deliverycharge);

        summary_arr_data.push({
            "cart_count": mycartdata,
            "realization": "0",
            "mrp": mrpprice,
            "selling_price": sellingprice,
            "delivery_charge": deliverycharge,
            "grand_total": grand_total
        })

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
                message: 'successfully low_category is displayed base on subcategory',
                "result": final_productdata,
                summary: summary_arr_data
            })
        }

    })
})

router.post('/brand', (req, res) => {
    var { brand } = req.body
    product.find({ brand }, (err, brand) => {
        if (err) {
            res.json({
                status: 'failed',
                message: 'failed to display'
            })
        } else {
            return res.json({
                status: 'success',
                message: 'successfully brand displayed',
                result: [brand]
            })
        }
    })
})
//product_APIS
router.post('/product_add', (req, res) => {
    product.find((error, allproduct) => {
        product_sku.find((error, allproduct_sku) => {

            var product_id = allproduct.length + 1
            var sku_id = allproduct_sku.length

            req.body._id = product_id

            var qry1 = { _id_category, name, pic, description, article_no, brand, best_price, mrp, selling_price, createBy, modifyBy } = req.body
            // var qry2 = {_id, product_id, size, stock, mrp, min_quantity, max_quantity, tax, selling_price, gst, pic }=req.body


            product.create(qry1, (err, allproduct) => {
                if (req.body.sku) {
                    for (var i = 0; i < req.body.sku.length; i++) {
                        var sku_data = {
                            _id: sku_id + i + 1,
                            _id_product: product_id,
                            size: req.body.sku[i].size,
                            stock: req.body.sku[i].stock,
                            mrp: req.body.sku[i].mrp,
                            min_quantity: req.body.sku[i].min_quantity,
                            max_quantity: req.body.sku[i].max_quantity,
                            tax: req.body.sku[i].tax,
                            selling_price: req.body.sku[i].selling_price,
                            gst: req.body.sku[i].gst,
                            pic: req.body.sku[i].pic,

                            warehouse_id: req.body.sku[i].warehouse_id,
                            createBy: req.body.sku[i].createBy,
                            modifyBy: req.body.sku[i].modifyBy
                        }
                        console.log(sku_data);
                        product_sku.create(sku_data, (err, allproduct_sku) => {
                            if (!err) {
                                return allproduct_sku;
                            }
                        });

                    }
                    if (err) {
                        return allproduct_sku;
                    } else {
                        return res.json({
                            status: 'success',
                            message: 'successfully product is added'

                        })
                    }

                }


            })
        })
    })
})


//................
//20





//5th
//custom side 
//product find by id both customer and session id 
router.post('/product_findby_id', async (req, res) => {
    var product_sku_arr = [];
    var productcartdata_arr = [];
    let final_cart_arr = [];
    var summary_arr_data = [];
    var { _id_customer, _id, session_id } = req.body
    var cart_count_data = 0;

    if (session_id) {
        await cart.find({ "session_id": session_id }, (err, productcartdata) => {
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
    } else {
        await cart.find({ "_id_customer": _id_customer }, (err, productcartdata) => {
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
    }
    console.log(cart_count_data);
    await product_sku.find(async (err, productskusdata) => {
        // console.log(productskusdata);
        await productskusdata.forEach(productskusdata => {
            product_sku_arr.push({
                "id": productskusdata._id,
                "id_product": productskusdata._id_product,
                "size": productskusdata.size,
                "stock": productskusdata.stock,
                "mrp": productskusdata.mrp,
                "min_quantity": productskusdata.min_quantity,
                "max_quantity": productskusdata.max_quantity,
                "tax": productskusdata.tax,
                "selling_price": productskusdata.selling_price,

                "warehouse_id": productskusdata.warehouse_id,
                "pic": productskusdata.pic
            });
        })
    });
    // let { id_lowcategory: id_lowcategory } = req.body;

    await product.find({ _id }, (err, data) => {
        let final_productdata = [];
        // console.log(data._doc);
        data.forEach(finalproductdat => {
            var final_sku_res = [];
            // console.log(final_sku_res);
            final_productdata.push({
                "id": finalproductdat._id,
                "id_category": finalproductdat._id_category,
                "id_subcategory": finalproductdat._id_subcategory,
                "id_lowcategory": finalproductdat._id_lowcategory,
                "name": finalproductdat.name,
                "article_no": finalproductdat.article_no,
                "mrp": finalproductdat.mrp,
                "selling_price": finalproductdat.selling_price,
                "best_price": finalproductdat.best_price,
                "description": finalproductdat.description,
                "brand": finalproductdat.brand,
                "pic": finalproductdat.pic,
                "sku": final_sku_res
            });

            product_sku_arr.forEach(finalskures => {
                console.log("finalskures");
                console.log(finalskures);
                console.log("finalskures");


                if (finalproductdat._id === finalskures.id_product) {
                    var mycart_res_data;
                    productcartdata_arr.forEach(productcartdata_arr_res => {
                        console.log("productcartdata_arr_res");
                        console.log(finalskures);
                        console.log("productcartdata_arr_res");
                        if (finalskures.id === productcartdata_arr_res.id_sku) {
                            console.log("hi");
                            console.log(productcartdata_arr_res.quantity);
                            if (productcartdata_arr_res.quantity) {
                                mycart_res_data = productcartdata_arr_res.quantity;
                            } else {
                                mycart_res_data = 0;
                            }
                        }
                    });
                    final_sku_res.push({
                        "id": finalskures.id,
                        "id_product": finalskures.id_product,
                        "size": finalskures.size,
                        "stock": finalskures.stock,
                        "mrp": finalskures.mrp,
                        "min_quantity": finalskures.min_quantity,
                        "max_quantity": finalskures.max_quantity,
                        "tax": finalskures.tax,
                        "selling_price": finalskures.selling_price,
                        "pic": finalskures.pic,
                        "warehouse_id": finalskures.warehouse_id,
                        "product_name": finalproductdat.name,
                        "mycart": mycart_res_data || 0
                    })
                    final_cart_arr.push({
                        "id": finalskures.id,
                        "id_product": finalskures.id_product,
                        "size": finalskures.size,
                        "stock": finalskures.stock,
                        "mrp": finalskures.mrp,
                        "min_quantity": finalskures.min_quantity,
                        "max_quantity": finalskures.max_quantity,
                        "tax": finalskures.tax,
                        "selling_price": finalskures.selling_price,
                        "pic": finalskures.pic,
                        "warehouse_id": finalskures.warehouse_id,
                        "product_name": finalproductdat.name,
                        "mycart": mycart_res_data || 0
                    })
                }
            })
        })


        let mrpprice = 0;
        let sellingprice = 0;
        let deliverycharge = 50;
        // let mycartdata = 0;
        let grand_total = 0;
        let mycartdata = cart_count_data;
        final_cart_arr.forEach(finalsummarydata => {
            console.log(finalsummarydata);
            // mycartdata = (parseInt(mycartdata) + parseInt(finalsummarydata.mycart));

            if (finalsummarydata.mycart > 0) {

                mrpprice = (parseInt(mrpprice) + parseInt(finalsummarydata.mrp));
                sellingprice = (parseInt(sellingprice) + parseInt(finalsummarydata.selling_price))
                grand_total = grand_total + (parseInt(finalsummarydata.mycart) * parseInt(finalsummarydata.selling_price));
            }

        });
        grand_total = grand_total + parseInt(deliverycharge);

        summary_arr_data.push({
            "cart_count": mycartdata,
            "realization": "0",
            "mrp": mrpprice,
            "selling_price": sellingprice,
            "delivery_charge": deliverycharge,
            "grand_total": grand_total
        })

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
                message: 'successfully low_category is displayed base on subcategory',
                "result": final_productdata,
                summary: summary_arr_data
            })
        }

    })
})


//status update as approved and rejected
router.post('/admin', (req, res, next) => {
    let { _id, status } = req.body
    product.findByIdAndUpdate(_id, { status }, (err, data) => {
        product.findOne({ _id: _id }, (err, data) => {
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
                    message: 'successfully  product status is updated',
                    result: data
                })
            }
        })
    })
})
//........................................
//Admin API


//26th feb
//admin side API
//based on low category display product
router.post('/admin_product_view_Onlowcat', async (req, res) => {
    var product_sku_arr = [];
    var productcartdata_arr = [];
    let final_cart_arr = [];
    var summary_arr_data = [];
    var { _id_customer, _id_lowcategory, session_id } = req.body
    var cart_count_data = 0;

    if (session_id) {
        await cart.find({ "session_id": session_id }, (err, productcartdata) => {
            productcartdata.forEach(productcartdata_res => {
                // console.log(productcartdata_res);
                productcartdata_arr.push(
                    {
                        "_id": productcartdata_res._id,
                        "_id_customer": productcartdata_res._id_customer,
                        "_id_product": productcartdata_res._id_product,
                        "_id_sku": productcartdata_res._id_sku,
                        "_id_warehouse": productcartdata_res._id_warehouse,
                        "quantity": productcartdata_res.quantity,
                        "session_id": productcartdata_res.session_id
                    }
                );
                cart_count_data = productcartdata.length;
            })
        });
    } else {
        await cart.find({ "_id_customer": _id_customer }, (err, productcartdata) => {
            productcartdata.forEach(productcartdata_res => {
                // console.log(productcartdata_res);
                productcartdata_arr.push(
                    {
                        "_id": productcartdata_res._id,
                        "_id_customer": productcartdata_res._id_customer,
                        "_id_product": productcartdata_res._id_product,
                        "_id_sku": productcartdata_res._id_sku,
                        "_id_warehouse": productcartdata_res._id_warehouse,
                        "quantity": productcartdata_res.quantity,
                        "session_id": productcartdata_res.session_id
                    }
                );
                cart_count_data = productcartdata.length;
            })
        });
    }
    console.log(cart_count_data);
    await product_sku.find(async (err, productskusdata) => {
        // console.log(productskusdata);
        await productskusdata.forEach(productskusdata => {
            product_sku_arr.push({
                "_id": productskusdata._id,
                "_id_product": productskusdata._id_product,
                "size": productskusdata.size,
                "stock": productskusdata.stock,
                "mrp": productskusdata.mrp,
                "min_quantity": productskusdata.min_quantity,
                "max_quantity": productskusdata.max_quantity,
                "tax": productskusdata.tax,
                "selling_price": productskusdata.selling_price,
                "warehouse_id": productskusdata.warehouse_id,
                "pic": productskusdata.pic
            });
        })
    });
    // let { id_lowcategory: id_lowcategory } = req.body;

    await product.find({ _id_lowcategory }, (err, data) => {
        let final_productdata = [];
        // console.log(data._doc);
        data.forEach(finalproductdat => {
            var final_sku_res = [];
            // console.log(final_sku_res);
            final_productdata.push({
                "_id": finalproductdat._id,
                "_id_category": finalproductdat._id_category,
                "_id_subcategory": finalproductdat._id_subcategory,
                "_id_lowcategory": finalproductdat._id_lowcategory,
                "name": finalproductdat.name,
                "article_no": finalproductdat.article_no,
                "mrp": finalproductdat.mrp,
                "selling_price": finalproductdat.selling_price,
                "best_price": finalproductdat.best_price,
                "description": finalproductdat.description,
                "brand": finalproductdat.brand,
                "pic": finalproductdat.pic,
                "status": finalproductdat.status,
                "sku": final_sku_res
            });

            product_sku_arr.forEach(finalskures => {
                console.log("finalskures");
                console.log(finalskures);
                console.log("finalskures");


                if (finalproductdat._id === finalskures._id_product) {
                    var mycart_res_data;
                    productcartdata_arr.forEach(productcartdata_arr_res => {
                        console.log("productcartdata_arr_res");
                        console.log(finalskures);
                        console.log("productcartdata_arr_res");
                        if (finalskures._id === productcartdata_arr_res._id_sku) {
                            console.log("hi");
                            console.log(productcartdata_arr_res.quantity);
                            if (productcartdata_arr_res.quantity) {
                                mycart_res_data = productcartdata_arr_res.quantity;
                            } else {
                                mycart_res_data = 0;
                            }
                        }
                    });
                    final_sku_res.push({
                        "_id": finalskures._id,
                        "_id_product": finalskures._id_product,
                        "size": finalskures.size,
                        "stock": finalskures.stock,
                        "mrp": finalskures.mrp,
                        "min_quantity": finalskures.min_quantity,
                        "max_quantity": finalskures.max_quantity,
                        "tax": finalskures.tax,
                        "selling_price": finalskures.selling_price,
                        "warehouse_id": finalskures.warehouse_id,
                        "pic": finalskures.pic,

                        "mycart": mycart_res_data || 0
                    })
                    final_cart_arr.push({
                        "_id": finalskures._id,
                        "_id_product": finalskures._id_product,
                        "size": finalskures.size,
                        "stock": finalskures.stock,
                        "mrp": finalskures.mrp,
                        "min_quantity": finalskures.min_quantity,
                        "max_quantity": finalskures.max_quantity,
                        "tax": finalskures.tax,
                        "selling_price": finalskures.selling_price,
                        "pic": finalskures.pic,

                        "warehouse_id": finalskures.warehouse_id,
                        "mycart": mycart_res_data || 0
                    })
                }
            })
        })


        let mrpprice = 0;
        let sellingprice = 0;
        let deliverycharge = 50;
        // let mycartdata = 0;
        let grand_total = 0;
        let mycartdata = cart_count_data;
        final_cart_arr.forEach(finalsummarydata => {
            console.log(finalsummarydata);
            // mycartdata = (parseInt(mycartdata) + parseInt(finalsummarydata.mycart));

            if (finalsummarydata.mycart > 0) {

                mrpprice = (parseInt(mrpprice) + parseInt(finalsummarydata.mrp));
                sellingprice = (parseInt(sellingprice) + parseInt(finalsummarydata.selling_price))
                grand_total = grand_total + (parseInt(finalsummarydata.mycart) * parseInt(finalsummarydata.selling_price));
            }

        });
        grand_total = grand_total + parseInt(deliverycharge);

        summary_arr_data.push({
            "cart_count": mycartdata,
            "realization": "0",
            "mrp": mrpprice,
            "selling_price": sellingprice,
            "delivery_charge": deliverycharge,
            "grand_total": grand_total
        })

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
                message: 'successfully low_category is displayed base on subcategory',
                "result": final_productdata,
                // summary: summary_arr_data
            })
        }

    })
})




//......................................

router.post('/delete', function (req, res) {
    let { _id } = req.body

    // product.deleteOne({}, function (err, data) {
    product.findOneAndDelete({ _id }, function (err, data) {
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
                message: 'sucessfully  product is cleared...!',
                result: data
            });
        }
    })
})




//get all product and sku with lookup
router.get('/all_get', function (req, res) {
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


//20th ...
//without lookup both product and sku get all for exa
//example api
router.get('/get', async (req, res) => {
    var resultcatdata = [];

    await product_sku.find((err, sku_data) => {
        product_getdata = sku_data;
    });

    await product.find((err, product_data) => {
        if (err) {
            res.send({
                status: 'failed',
                message: 'failed to display'
            });
        }

        else if (!product_data) {
            res.send({
                status: "success",
                message: "No data found",
            });
        }
        else {

            product_data.forEach(cat_data_result => {
                var resultdata = [];
                product_getdata.forEach(sub_getdata_result => {
                    var resultlowdata = [];

                    if (sub_getdata_result._id_product === cat_data_result._id) {
                        resultdata.push({
                            "_id": sub_getdata_result._id,
                            "_id_product": sub_getdata_result._id_product,
                            "name": sub_getdata_result.name,
                            "_id_category": sub_getdata_result._id_category,
                            "size": sub_getdata_result.size,
                            "stock": sub_getdata_result.stock,
                            "min_quantity": sub_getdata_result.min_quantity,
                            "max_quantity": sub_getdata_result.max_quantity,
                            "tax": sub_getdata_result.tax,
                            "selling_price": sub_getdata_result.selling_price,
                            "pic": sub_getdata_result.pic,
                            "warehouse_id": sub_getdata_result.warehouse_id,
                        });
                    }



                })
                resultcatdata.push({
                    "_id": cat_data_result._id,
                    "status": cat_data_result.status,
                    "name": cat_data_result.name,
                    "_id_category": cat_data_result._id_category,
                    "_id_subcategory": cat_data_result._id_subcategory,
                    "_id_lowcategory": cat_data_result._id_lowcategory,
                    "name": cat_data_result.name,
                    "article_no": cat_data_result.article_no,
                    "mrp": cat_data_result.mrp,
                    "selling_price": cat_data_result.selling_price,
                    "selling_price": cat_data_result.selling_price,
                    "best_price": cat_data_result.best_price,
                    "description": cat_data_result.description,
                    "brand": cat_data_result.brand,
                    "createBy": cat_data_result.createBy,
                    "modifyBy": cat_data_result.modifyBy,
                    "pic": cat_data_result.pic,
                    "sku": resultdata
                });
            })

        }


        // let mycartdata = cart_count_data;
        res.send({
            "status": "success",
            "message": "Get Successfully",
            "product": resultcatdata,
            // "summ":mycartdata
            // "cart_count": mycartdata,


        });
    })

})



//......
router.post('/edit', (req, res, next) => {
    let { _id } = req.body
    product.findOneAndUpdate({ _id }, req.body, (err, data) => {
        product.findOne({ _id: _id }, (err, data) => {
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
                    message: 'successfully  product is updated',
                    result: data
                })
            }
        })
    })
})


//find sku by product id
//_id_product
router.post('/sku_findby_id', function (req, res) {
    let { _id_product: _id_product } = req.body
    product_sku.find({ _id_product }, (err, data) => {
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
            return res.json({
                status: 'success',
                message: 'successfully  product_sku is displayed',
                result: data
            })
        }
    })
})


//view by category name
router.post('/searchBy_product_name', function (req, res) {
    let { name: name } = req.body
    product.findOne({ name }, (err, data) => {
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
                message: 'successfully  product is displayed',
                result: data
            })
        }
    })
})


//20th
router.post('/20_product_findby_id', async (req, res) => {
    var product_sku_arr = [];
    var productcartdata_arr = [];
    let final_cart_arr = [];
    var summary_arr_data = [];

    await cart.find(async (err, productcartdata) => {
        await productcartdata.forEach(productcartdata_res => {
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
        })
    });

    await product_sku.find(async (err, productskusdata) => {
        // console.log(productskusdata);
        await productskusdata.forEach(productskusdata => {
            product_sku_arr.push({
                "id": productskusdata._id,
                "id_product": productskusdata._id_product,
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
    });
    let { _id: _id } = req.body;

    await product.find({ _id }, (err, data) => {


        let final_productdata = [];

        // console.log(data._doc);
        data.forEach(finalproductdat => {
            var final_sku_res = [];

            // console.log(final_sku_res);
            final_productdata.push({
                "id": finalproductdat._id,
                "id_category": finalproductdat._id_category,
                "id_subcategory": finalproductdat._id_subcategory,
                "id_lowcategory": finalproductdat._id_lowcategory,
                "name": finalproductdat.name,
                "article_no": finalproductdat.article_no,
                "mrp": finalproductdat.mrp,
                "selling_price": finalproductdat.selling_price,
                "best_price": finalproductdat.best_price,
                "description": finalproductdat.description,
                "brand": finalproductdat.brand,
                "pic": finalproductdat.pic,
                "sku": final_sku_res
            });

            product_sku_arr.forEach(finalskures => {
                console.log("finalskures");
                console.log(finalskures);
                console.log("finalskures");


                if (finalproductdat._id === finalskures.id_product) {
                    var mycart_res_data;
                    productcartdata_arr.forEach(productcartdata_arr_res => {
                        console.log("productcartdata_arr_res");
                        console.log(finalskures);
                        console.log("productcartdata_arr_res");
                        if (finalskures.id === productcartdata_arr_res.id_sku) {
                            console.log("hi");
                            console.log(productcartdata_arr_res.quantity);
                            if (productcartdata_arr_res.quantity) {
                                mycart_res_data = productcartdata_arr_res.quantity;
                            } else {
                                mycart_res_data = 0;
                            }
                        }
                    });
                    final_sku_res.push({
                        "id": finalskures.id,
                        "id_product": finalskures.id_product,
                        "size": finalskures.size,
                        "stock": finalskures.stock,
                        "mrp": finalskures.mrp,
                        "min_quantity": finalskures.min_quantity,
                        "max_quantity": finalskures.max_quantity,
                        "tax": finalskures.tax,
                        "selling_price": finalskures.selling_price,
                        "pic": finalskures.pic,
                        "mycart": mycart_res_data || 0
                    })
                    final_cart_arr.push({
                        "id": finalskures.id,
                        "id_product": finalskures.id_product,
                        "size": finalskures.size,
                        "stock": finalskures.stock,
                        "mrp": finalskures.mrp,
                        "min_quantity": finalskures.min_quantity,
                        "max_quantity": finalskures.max_quantity,
                        "tax": finalskures.tax,
                        "selling_price": finalskures.selling_price,
                        "pic": finalskures.pic,
                        "mycart": mycart_res_data || 0
                    })

                }

                // console.log("mycart_res_data");
                // console.log(mycart_res_data);
                // console.log("mycart_res_data");
            })
        })


        let mrpprice = 0;
        let sellingprice = 0;
        let deliverycharge = 50;
        let mycartdata = 0;
        let grand_total = 0;
        final_cart_arr.forEach(finalsummarydata => {
            console.log(finalsummarydata);
            mycartdata = (parseInt(mycartdata) + parseInt(finalsummarydata.mycart));
            if (finalsummarydata.mycart > 0) {
                mrpprice = (parseInt(mrpprice) + parseInt(finalsummarydata.mrp));
                sellingprice = (parseInt(sellingprice) + parseInt(finalsummarydata.selling_price))
                grand_total = grand_total + (parseInt(deliverycharge) + parseInt(finalsummarydata.mycart) * parseInt(finalsummarydata.selling_price));
            }
        });

        summary_arr_data.push({
            "cart_count": mycartdata,
            "realization": "0",
            "mrp": mrpprice,
            "selling_price": sellingprice,
            "delivery_charge": deliverycharge,
            "grand_total": grand_total
        })

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
                message: 'successfully product is displayed',
                "result": final_productdata,
                summary: summary_arr_data
            })
        }

    })
})



//view by category id
router.post('/findby_id', function (req, res) {
    let { _id: _id } = req.body
    product.findOne({ _id }, (err, data) => {
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
            return res.json({
                status: 'success',
                message: 'successfully  product is displayed',
                result: data
            })
        }
    })
})


module.exports = router