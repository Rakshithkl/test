var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var schema = new mongoose.Schema({
    _id: Number,
   _id_product:Number,
//    sku:String,
   size:String,
   stock:String,
   mrp:String,
   min_quantity:String,
   max_quantity:String,
   tax:String,
   selling_price:String,
   gst:String,
   pic:Array,
   // pic:String,
 warehouse_id:Number,


    
    createOn: { type: Date, default: Date.now },
    createBy: String,
    modifyOn: { type: Date, default: Date.now },
    modifyBy: String,
}, { versionKey: false })


module.exports = mongoose.model('product_sku', schema)








