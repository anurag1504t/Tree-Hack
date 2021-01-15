const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Feeds = require('../models/feed');
var authenticate = require('../authenticate');

const feedRouter = express.Router();
feedRouter.use(bodyParser.json());

// Methods for http://localhost:3000/feeds/ API end point
feedRouter.route('/')
.get((req,res,next) => {
    Feeds.find(req.query)
    .then((feeds) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(feeds);
    })
    .catch((err) => res.json({err:err}));
})
.post(authenticate.verifyUser, (req, res, next) => {
    let f=Feeds({feeds:req.body.feeds})
    f.save()
    .then((feed) => {
        console.log('Feed Created ', feed);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(feed);
    })
    .catch((err) => res.json({err:err}));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /feeds');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Feeds.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

// Methods for http://localhost:3000/feeds/:feedId API end point
feedRouter.route('/:feedId')
.get((req,res,next) => {
    Feeds.findById(req.params.feedId)
    .then((feed) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(feed);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /feeds/${req.params.feedId}`);
})
.put(authenticate.verifyUser, (req, res, next) => {
    Feeds.findByIdAndUpdate(req.params.feedId, {
        $set: req.body
    }, { new: true })
    .then((feed) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(feed);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Feeds.findByIdAndRemove(req.params.feedId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) =>res.json({err:err}));
});

module.exports = feedRouter;