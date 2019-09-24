var mongoose = require('mongoose')

var schema = new mongoose.Schema({
    _id: Number,
    _id_subcategory:Number,
    _id_category:Number,
    name: String,
    parent: String,
    pic: String,
    description: String,



    createOn: { type: Date, default: Date.now },
    createBy: String,
    modifyOn: { type: Date, default: Date.now },
    modifyBy: String,
    // subcategory:{

    // name:String,
    //  parent:String,
    //  pic:String,
    //  description:String,
    // }
    // product:[{ type: mongoose.Schema.Types.ObjectId, ref: 'product'}],
    // _id_product_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'product'}


}, { versionKey: false })

module.exports = mongoose.model('low_category', schema)



