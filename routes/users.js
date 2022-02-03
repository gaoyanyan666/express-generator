const express = require('express');
const User = require('../models/user');

const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
//  get more routes
router.post('/signup', (req, res, next) => {
  //check if the user is exist
    User.findOne({username: req.body.username})
    .then(user => {
        if (user) {
            const err = new Error(`User ${req.body.username} already exists!`);
            err.status = 403;
            return next(err);
        } else {
          //use doesnt exist, create new user
            User.create({
                username: req.body.username,
                password: req.body.password})
            .then(user => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({status: 'Registration Successful!', user: user});
            })
            .catch(err => next(err));
        }
    })
    .catch(err => next(err));
});

router.post('/login', (req, res, next) => {
  //session does not exist user,then we need to handle the login
    if(!req.session.user) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            const err = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            return next(err);
        }
      
        const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        const username = auth[0];
        const password = auth[1];
      // check the user document in the database
        User.findOne({username: username})
        .then(user => {
          //user does not exist
            if (!user) {
                const err = new Error(`User ${username} does not exist!`);
                err.status = 401;
                return next(err);
            } else if (user.password !== password) {
              //user password is wrong
                const err = new Error('Your password is incorrect!');
                err.status = 401;
                return next(err);
            } else if (user.username === username && user.password === password) {
              //finial check username and password match
                req.session.user = 'authenticated';
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('You are authenticated!')
            }
        })
        .catch(err => next(err));
    } else {
      //session user exists already
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are already authenticated!');
    }
});

router.get('/logout', (req, res, next) => {
  //check if the session exists
    if (req.session) {
      //delete session
        req.session.destroy();
        //clear the cookie stored on the client side
        res.clearCookie('session-id');
        res.redirect('/');
    } else {
        const err = new Error('You are not logged in!');
        err.status = 401;
        return next(err);
    }
});

module.exports = router;
