const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {pagesize}=require('../config')
const Products = require('../models/product');
var authenticate = require('../authenticate');
const Category=require('../models/category');
const Carts = require('../models/cart');
const Orders = require('../models/order');

const productRouter = express.Router();
productRouter.use(bodyParser.json());

productRouter.route('/getcategory')
.get(authenticate.verifyUser,(req,res,next) => {
    console.log("getcategory route")
    /*Category.find({})
    .then((cat) => {
        console.log(cat)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({category:cat});
    })
    .catch((err) => res.json({err}));*/
    Products.find().distinct('category',function(err,result){
        if(err) res.json({err})
        else res.json({category:result})
    })
})

productRouter.route('/search')
.post((req,res,next) => {
    const query=req.body.query
    const pgnum=req.body.pgnum
    const p=new RegExp(query,"i")
    Products.find({name:{$regex:p}})
    .limit(pagesize)
    .skip(pagesize*(pgnum-1))
    .then(product=>{
        Products.countDocuments({name:{$regex:p}})
        .exec((err,c)=>{
       let pages=Math.ceil(c/pagesize)
        res.json({products:product,pages:pages})
        })
    }).catch(err=>res.json({err}))
})
productRouter.route('/category')
.post((req,res,next) => {
    const query=req.body.query
    const pgnum=req.body.pgnum
    Products.find({category:query})
    .limit(pagesize)
    .skip(pagesize*(pgnum-1))
    .then(product=>{
        console.log(product)
       Products.countDocuments({category:query})
       .exec((err,c)=>{
       let pages=Math.ceil(c/pagesize)
        res.json({products:product,pages:pages})
        })
    }).catch(err=>res.json({err}))
})
productRouter.route('/allproducts')
.post((req,res,next) => {
    const pgnum=req.body.pgnum
    Products.find({})
    .limit(pagesize)
    .skip(pagesize*(pgnum-1))
    .then(product=>{
        console.log(product)
       Products.countDocuments({})
       .exec((err,c)=>{
       let pages=Math.ceil(c/pagesize)
        res.json({products:product,pages:pages})
        })
    }).catch(err=>res.json({err}))
})

// Methods for http://localhost:3000/products/ API end point
productRouter.route('/add/')
.get((req,res,next) => {
    Products.find({})
    .then((products) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(products);
    })
    .catch((err) => res.json({err}));
})
.post(authenticate.verifyUser, (req, res, next) => {
    let p=Products(req.body)
    p.save()
    .then((product) => {
        console.log('Product Created ', product);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(product);
    })
    .catch((err) =>res.json({err}));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /products');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Products.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

// Methods for http://localhost:3000/products/:productId API end point
productRouter.route('/:productId')
.get((req,res,next) => {
    Products.findById(req.params.productId)
    .then((product) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(product);
    }, (err) => next(err))
    .catch((err) => res.json({err}));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /products/'+ req.params.productId);
})
.put(authenticate.verifyUser, (req, res, next) => {

    Products.findById(req.params.productId)
    .then((prod) => {
        if(prod != null) {
            prod.name=req.body.name;
            prod.quantity=req.body.quantity;
            prod.maxQuantity=req.body.maxQuantity;
            prod.price=req.body.price;
            prod.image=req.body.image;
            prod.size=req.body.size;
            prod.category=req.body.category;


            prod.save()
            .then((prod) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(prod);              
            }, (err) => res.json({err}));
        }
        else {
            err = new Error('product not found');
            err.status = 404;
            return next(err);
        }
    })
    .catch((err) => res.json({err}));


    /*Products.findByIdAndUpdate(req.params.productId, {
        $set: req.body
    }, { new: true })
    .then((product) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(product);
    }, (err) => next(err))
    .catch((err) => res.json({err}));

    */
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Carts.updateMany({},  
        {$pull:{items:{item:req.params.productId}}}, function (err, docs) { 
        if (err){ 
            res.json({err}) 
        } 
        else{
            Orders.updateMany({},  
                {$pull:{items:{item:req.params.productId}}}, function (err, docs) { 
                if (err){ 
                    res.json({err}) 
                } 
                else{
                    Products.findByIdAndRemove(req.params.productId)
                    .then((resp) => {
                        Orders.deleteMany({items:[]})
                            .then(od=>{
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(resp);
                            }).catch((err) => res.json({err}));
                        
                    })
                    .catch((err) => res.json({err}));
                 }
            });
         }
    }); 
    
});


productRouter.route('/productvalues/update')
.put(authenticate.verifyUser, (req, res, next) => {
    const {id,quantity,price,maxquantity}=req.body
  Products.findById(id)
  .then(prod=>{
    prod.quantity=quantity
    prod.price=price
    prod.maxQuantity=maxquantity
    prod.save()
    .then(result=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    }).catch(err=>{
        res.json({err:err})
    })
  }) 
})

module.exports = productRouter;