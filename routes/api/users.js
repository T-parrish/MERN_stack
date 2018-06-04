// External libraries
const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// Keys 
const keys = require('../../config/keys')

// Load Input Validation
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

// Load user model
const User = require('../../models/User');

// @route    GET api/users/test
// @desc     Tests POST route
// @access   Public
router.get('/test', (req, res) => res.json({msg: 'user works'}));

// @route    POST api/users/register
// @desc     Registers a new user
// @access   Public
router.post('/register', (req, res) => {
    // validates the input from the request
    const { errors, isValid } = validateRegisterInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors)
    }

    User.findOne({ email: req.body.email })
        .then(user => {
            if(user) {
                errors.email = 'Email already exists';
                return res.status(400).json(errors);
            } else {
                const avatar = gravatar.url(req.body.email, { 
                    s: '200', // Size
                    r: 'pg',  // Rating (PG, G, R)
                    d: 'mm'   // Default 'egg'
                });

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar, 
                    password: req.body.password
                });
                
                // Generates salt of length 10, give it a callback
                // that takes an error if there is one, or returns a salt
                bcrypt.genSalt(10, (err, salt) => {
                    // Hashes the newUser object password with the salt
                    // takes an error if there is one, otherwise returns the hashed pw
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        // Sets the newUser password = generated hash
                        newUser.password = hash;
                        // Saves the updated newUser object
                        newUser.save()
                            // Sends the modified newUser object as a json response
                            .then(user => res.json(user))
                            // catches error and logs error if something 
                            // goes wrong with the promise chain
                            .catch(err => console.log(err));
                    })
                });
            }
        });
});

// @route    POST api/users/login
// @desc     Login User / return JWT token
// @access   Public   
router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors)
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find user by email, returns promise
    User.findOne({ email })
        // If there is a matching user, you get access to it
        .then(user => {
            // If user does not exist, return 404 and error message
            if(!user) {
                errors.email = 'User not found';
                return res.status(404).json(errors)
            }
            
            // Check password against matched user object, returns promise
            bcrypt.compare(password, user.password)
                // If hashed password matches entered password, do stuff
                .then(isMatch => {
                    if(isMatch) {
                        // Payload for JWT
                        const payload = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        }

                        // Sign token with payload, secret key, 
                        // expiration date (seconds), and callback
                        jwt.sign(
                            payload, 
                            keys.jwtSecret, 
                            { expiresIn: 3600}, 
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                });
                        });

                    } else {
                        // If hashed pw and entered pw don't match, 
                        // Set status -> 400 and send err message
                        errors.password = 'Password incorrect'
                        return res.status(400).json(errors)
                    }
                });
        });
});

// @route    GET api/users/current
// @desc     Return current user profile
// @access   Private   
router.get('/current', 
    passport.authenticate('jwt', {session: false}), 
    (req, res) => {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        });
});

module.exports = router;