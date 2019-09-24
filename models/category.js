var mongoose = require('mongoose')

var schema = new mongoose.Schema({
    _id: Number,
    name:String,
    parent:String,
    pic:String,
    description:String,



    
    createOn: { type: Date, default: Date.now },
    createBy: String,
    modifyOn: { type: Date, default: Date.now },
    modifyBy: String,

  
  
}, { versionKey: false })

module.exports = mongoose.model('category', schema)