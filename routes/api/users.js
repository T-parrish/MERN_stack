// External libraries
const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// Load user model
const User = require('../../models/User');

// @route    GET api/users/test
// @desc     Tests POST route
// @access   Public
router.get('/test', (req, res) => res.json({msg: 'user works'}));

// @route    POST api/users/register
router.post('/register', (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if(user) {
                return res.status(400).json({email: 'Email already exists'});
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
    const email = req.body.email;
    const password = req.body.password;

    // Find user by email, returns promise
    User.findOne({ email })
        // If there is a matching user, you get access to it
        .then(user => {
            // If user does not exist, return 404 and error message
            if(!user) {
                return res.status(404).json({email: 'User not found'})
            }
            
            // Check password against matched user object, returns promise
            bcrypt.compare(password, user.password)
                // If hashed password matches entered password, do stuff
                .then(isMatch => {
                    if(isMatch) {
                        res.json({msg: 'Success'})
                    } else {
                        // If hashed pw and entered pw don't match, 
                        // Set status -> 400 and send err message
                        return res.status(400).json({password: 'Incorrect password'})
                    }
                });
        });
});

module.exports = router;