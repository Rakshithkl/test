var express=require('express');
var app=express();
var mongoose=require('mongoose');
var morgan=require('morgan')
var cors = require('cors')
app.use(cors())
var bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var customer_table=require('./routes/customer_table')
var category=require('./routes/category')
var product=require('./routes/product')
var product_sku=require('./routes/product_sku')
var cart=require('./routes/cart')


app.use('/customer_table',customer_table)
app.use('/category',category)
app.use('/product',product)
app.use('/product_sku',product_sku)


app.use('/terms_candi',terms_candi)
app.use('/cart',cart)




var port=4000;
mongoose.promis=global.promise;
 var dburl_server="mongodb://localhost:27017/Demo";
mongoose.connect(dburl_server,{useNewUrlParser:true})

// app.listen(port,()=>{console.log("server is running on port"+
// port)})
app.set('port', (process.env.PORT || 4000));
app.listen(app.get('port'), function() {
    console.log('Server started on port '+app.get('port'));
});

