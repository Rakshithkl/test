var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var schema = new mongoose.Schema({
  _id: Number,
  _id_category: Number,
  _id_subcategory: Number,
  _id_lowcategory: Number,
  // quantity: Number,
  // stock:Number,
  actual_price: String,
  offer_price: String,
  best_price: String,
  mrp: String,
  selling_price: String,
  // pic: String,
  pic: Array,
  //   pic:[{ 
  //     _id:Number,
  //     pic:String
  // }],
  name: String,
  price: String,
  image: String,
  description: String,
  article_no: String,
  brand: String,
  status: { type: String, default: "approved" },



  createOn: { type: Date, default: Date.now },
  createBy: String,
  modifyOn: { type: Date, default: Date.now },
  modifyBy: String,
  // category:[{ type: mongoose.Schema.Types.ObjectId, ref: 'category'}]
}, { versionKey: false })


module.exports = mongoose.model('product', schema)








