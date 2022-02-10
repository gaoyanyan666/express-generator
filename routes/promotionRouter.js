const express = require('express');
const Promotion = require('../models/promotion');
const authenticate = require('../authenticate');
const cors =require('./cors');

const promotionRouter = express.Router();

promotionRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))//preflight request to check 
.get(cors.cors,(req, res, next) => {
    Promotion.find()
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Promotion.create(req.body)
    .then(promotion => {
        console.log('Campsite Created ', promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser,(req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotion');
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res) => {
    Promotion.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});


promotionRouter.route('/:promotionId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))//preflight request to check 
.get(cors.cors,(req, res, next) => {
    Promotion.findById(req.params.promotionId)
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res) => {
    res.statusCode = 403;
    res.end(`Will add the promotion ${req.params.promotionId} with description`);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Promotion.findByIdAndUpdate(req.params.promotionId, {
        $set: req.body
    }, { new: true })
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Promotion.findByIdAndDelete(req.params.promotionId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = promotionRouter;