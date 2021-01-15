const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Carts = require('../models/cart');
var authenticate = require('../authenticate');

const cartRouter = express.Router();
cartRouter.use(bodyParser.json());


cartRouter.route('/emptycart')
.get(authenticate.verifyUser,(req,res,next) => {
    Carts.findOne({buyer:req.user._id})
    .then((carts) => {
        carts.items=[]
        carts.save()
        .then(cart=>{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(cart);
        }).catch(err=>res.json({err}))
        
    }, (err) => next(err))
    .catch((err) => next(err));
})

// Methods for http://localhost:3000/cart/ API end point
cartRouter.route('/')
.get(authenticate.verifyUser,(req,res,next) => {
    Carts.findOne({buyer:req.user._id})
    .populate('buyer')
    .populate('items.item')
    .then((carts) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(carts);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Carts.create(req.body)
    .then((cart) => {
        console.log('Cart created ', cart);
        Carts.findById(cart._id)
        .populate('buyer')
        .populate('items.item')
        .then((cart) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(cart);
        })        
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /cart');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Carts.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

// Method for http://localhost:3000/cart/add/:itemId API end point
cartRouter.route('/add/:itemId')
.put(authenticate.verifyUser, (req,res,next) => {
    Carts.findOne({buyer : req.user._id})
    .then((cart) => {
        if (cart != null) {
            var changed = false;
            for (var i = (cart.items.length -1); i >= 0; i--) {
                if(cart.items[i].item.equals(req.params.itemId)) {
                    changed = true;
                    cart.items[i].quantity = cart.items[i].quantity + 1;
                    break;
                }
            }
            if(changed != true) {
                cart.items.push({item: req.params.itemId, quantity: 1});
            }
            cart.save()
            .then((cart) => {
                Carts.findById(cart._id)
                .populate('buyer')
                .populate('items.item')
                .then((cart) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(cart);
                })               
            }, (err) => next(err));
        }
        else {
            err = new Error(`Cart of user ${req.user._id} not found`);
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

// Method for http://localhost:3000/cart/remove/:itemId API end point
cartRouter.route('/remove/:itemId')
.put(authenticate.verifyUser, (req,res,next) => {
    Carts.findOne({buyer : req.user._id})
    .then((cart) => {
        if(cart != null) {
            for (var i = (cart.items.length -1); i >= 0; i--) {
                if(cart.items[i].item == req.params.itemId) {
                    changed = true;
                    if(cart.items[i].quantity > 0) {
                        
                        

                        if(cart.items[i].quantity==1){
                            cart.items[i]=cart.items[cart.items.length-1];
                            cart.items.pop()
                        }else{
                            cart.items[i].quantity = cart.items[i].quantity - 1;
                        }
                        
                        cart.save()
                        .then((cart) => {
                            Carts.findById(cart._id)
                            .populate('buyer')
                            .populate('items.item')
                            .then((cart) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(cart);
                            })                                    
                        }, (err) => next(err));
                    }
                    break;
                }
            }            
        }
        else {
            err = new Error(`Cart of user ${req.user._id} not found`);
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

// Methods for http://localhost:3000/cart/:cartId API end point
cartRouter.route('/:cartId')
.get((req,res,next) => {
    Carts.findById(req.params.cartId)
    .populate('buyer')
    .populate('items.item')
    .then((cart) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(cart);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /cart/${req.params.cartId}`);
})
.put(authenticate.verifyUser, (req, res, next) => {
    Carts.findByIdAndUpdate(req.params.cartId, {
        $set: req.body
    }, { new: true })
    .then((cart) => {
        Carts.findById(cart._id)
        .populate('buyer')
        .populate('items.item')
        .then((cart) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(cart);
        })
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Carts.findByIdAndRemove(req.params.cartId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

// Methods for http://localhost:3000/cart/:cartId/items API end point
cartRouter.route('/:cartId/items')
.get((req,res,next) => {
    Carts.findById(req.params.cartId)
    .populate('buyer')
    .populate('items.item')
    .then((cart) => {
        if (cart != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(cart.items);
        }
        else {
            err = new Error(`Cart ${req.params.cartId} not found`);
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Carts.findById(req.params.cartId)
    .then((cart) => {
        if (cart != null) {
            cart.items.push(req.body);
            cart.save()
            .then((cart) => {
                Carts.findById(cart._id)
                .populate('buyer')
                .populate('items.item')
                .then((cart) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(cart);
                })               
            }, (err) => next(err));
        }
        else {
            err = new Error(`Cart ${req.params.cartId} not found`);
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /cart/${req.params.cartId}/items`);
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Carts.findById(req.params.cartId)
    .then((cart) => {
        if (cart != null) {
            for (var i = (cart.items.length -1); i >= 0; i--) {
                cart.item.id(cart.items[i]._id).remove();
            }
            cart.save()
            .then((cart) => {
                Carts.findById(cart._id)
                .populate('buyer')
                .populate('items.item')
                .then((cart) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(cart);
                })             
            }, (err) => next(err));
        }
        else {
            err = new Error(`Cart ${req.params.cartId} not found`);
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

// Methods for http://localhost:3000/cart/:cartId/items/:itemId API end point
cartRouter.route('/:cartId/item/:itemId')
.get((req,res,next) => {
    Carts.findById(req.params.cartId)
    .populate('buyer')
    .populate('items.item')
    .then((cart) => {
        if(cart != null) {
            if(cart.items.id(req.params.itemId) != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(cart.cartId.id(req.params.itemId));
            }
            else {
                err = new Error(`Item ${req.params.itemId} not found`);
                err.status = 404;
                return next(err);
            }
        }
        else {
            err = new Error(`Cart ${req.params.cartId} not found`);
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /cart/${req.params.cartId}/items/${req.params.itemId}`);
})
.put(authenticate.verifyUser, (req, res, next) => {
    Carts.findById(req.params.cartId)
    .then((cart) => {
        if(cart != null) {
            if(cart.items.id(req.params.itemId) != null) {
                if (req.body.item) {
                    cart.items.id(req.params.itemId).item = req.body.item;
                }
                if (req.body.quantity) {
                    cart.items.id(req.params.itemId).quantity = req.body.quantity;                
                }
                cart.save()
                .then((cart) => {
                    Carts.findById(cart._id)
                    .populate('buyer')
                    .populate('items.item')
                    .then((cart) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(cart);
                    })                                    
                }, (err) => next(err));
            }
            else {
                err = new Error(`Item ${req.params.itemId} not found`);
                err.status = 404;
                return next(err);
            }
        }
        else {
            err = new Error(`Cart ${req.params.cartId} not found`);
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Carts.findById(req.params.cartId)
    .then((cart) => {
        if(cart != null) {
            if(cart.items.id(req.params.itemId) != null) {
                cart.item.id(req.params.itemId).remove();
                cart.save()
                .then((cart) => {
                    Carts.findById(cart._id)
                    .populate('buyer')
                    .populate('items.item')
                    .then((cart) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(cart);
                    })                                    
                }, (err) => next(err));
            }
            else {
                err = new Error(`Item ${req.params.itemId} not found`);
                err.status = 404;
                return next(err);
            }
        }
        else {
            err = new Error(`Cart ${req.params.cartId} not found`);
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));   
});

module.exports = cartRouter;