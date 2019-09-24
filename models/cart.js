
var mongoose=require('mongoose')
var schema=new mongoose.Schema({
    _id:Number,
    _id_product:Number,
    _id_sku:Number,
    _id_customer:Number,
    quantity:Number,
    session_id:String,
    _id_warehouse:Number,
    // lat:Number,   
    // long:Number, 


    createOn: { type: Date, default: Date.now },
    createBy: String,
    modifyOn: { type: Date, default: Date.now },
    modifyBy: String,
    
},{versionKey:false})

module.exports=mongoose.model('cart',schema)



// "product_id":2,
// "sku_id":1,
// "customer_id":2,
// "session_id":"19153788148715432_NAM",
// "quantity":1