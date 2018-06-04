// External libraries
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load models
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// Validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// @route    GET api/profile/test
// @desc     Tests POST route
// @access   Public
router.get('/test', (req, res) => res.json({msg: 'profile works'}));

// @route    GET api/profile
// @desc     Get current user's profile
// @access   Private
router.get('/', 
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const errors = {}
        Profile.findOne({user : req.user.id})
            // fills with data from other db model
            // in this case, fills name and avatar from user model 
            .populate('user', ['name', 'avatar'])
            .then(profile => {
                if(!profile) {
                    errors.noprofile = 'No profile for this user'
                    return res.status(404).json(errors);
                }
                res.json(profile)
            })
            .catch(err => res.status(404).json(err));
    }
);

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user id
// @access   Public
router.get('/user/:user_id', (req, res) => {
    const errors = {}
    Profile.findOne({ user: req.params.user_id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'There is no profile for this user'
                res.status(404).json(errors)
            }

            res.json(profile)
        })
        .catch(err => res.status(404).json({ profile: 'there is no profile for this user' }));
});

// @route    GET api/profile/all
// @desc     Get all profiles
// @access   Public
router.get('/all', (req, res) => {
    const errors = {}
    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if(!profiles) {
                errors.noprofile = 'There are no profiles'
                return res.status(404).json(errors)
            }
            res.json(profiles)
        })
        .catch(err => res.status(404).json({profile: 'There are no profiles'}))
});

// @route    POST api/profile/experience
// @desc     Add experience to profile
// @access   Private
router.post('/experience', 
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validateExperienceInput(req.body)

        if(!isValid) {
            return res.status(400).json(errors)
        };

        Profile.findOne({ user: req.user.id })
            .then(profile => {
                const newExp = {
                    title: req.body.title,
                    company: req.body.company,
                    location: req.body.location,
                    from: req.body.from,
                    to: req.body.to,
                    current: req.body.current,
                    description: req.body.description
                }

                profile.experience.unshift(newExp);
                profile.save().then(profile => res.json(profile))
            })
    });

// @route    POST api/profile/education
// @desc     Add education to profile
// @access   Private
router.post('/education', 
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validateEducationInput(req.body)

        if(!isValid) {
            return res.status(400).json(errors)
        };

        Profile.findOne({ user: req.user.id })
            .then(profile => {
                const newEdu = {
                    school: req.body.school,
                    degree: req.body.degree,
                    fieldofstudy: req.body.fieldofstudy,
                    from: req.body.from,
                    to: req.body.to,
                    description: req.body.description,
                    current: req.body.current
                }

                profile.education.unshift(newEdu);
                profile.save().then(profile => res.json(profile))
            })
    });


// @route    GET api/profile/handle/:handle
// @desc     Get profile by handle
// @access   Public
router.get('/handle/:handle', (req, res) => {
    const errors = {}
    Profile.findOne({ handle: req.params.handle })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'There is no profile for this user'
                res.status(404).json(errors)
            }

            res.json(profile)
        })
        .catch(err => res.status(404).json(err));
});


// @route    POST api/profile
// @desc     Create or edit user profile
// @access   Private
router.post('/', 
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        // Validate request body and store errors (if any)
        const { errors, isValid } = validateProfileInput(req.body)

        if(!isValid) {
            return res.status(400).json(errors)
        };

        // Get fields
        // Initialize the profileField object to store the data
        const profileFields = {};
        profileFields.user = req.user.id;
        if(req.body.handle) profileFields.handle = req.body.handle 
        if(req.body.company) profileFields.company = req.body.company 
        if(req.body.website) profileFields.website = req.body.website  
        if(req.body.location) profileFields.location = req.body.location  
        if(req.body.status) profileFields.status = req.body.status  
        if(req.body.bio) profileFields.bio = req.body.bio  
        if(req.body.githubusername) profileFields.githubusername = req.body.githubusername  

        // Skills - need to split into array
        if (typeof req.body.skills !== 'undefined') {
            profileFields.skills = req.body.skills.split(',');
        }

        // Social - need to initialize first since it's an object within an object
        profileFields.social = {};
        if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
        if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
        if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
        if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
        if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

        Profile.findOne({ user : req.user.id })
            .then(profile => {
                if(profile) {
                    Profile.findOneAndUpdate(
                        { user: req.user.id }, 
                        { $set: profileFields },
                        { new: true }
                    )
                    .then(profile => res.json(profile));
                } else {
                    Profile.findOne({ handle: profileFields.handle })
                        .then(profile => {
                            if (profile) {
                                errors.handle = 'That handle already exists';
                                res.status(400).json(errors);
                            }

                            new Profile(profileFields)
                                .save()
                                .then(profile => res.json(profile));

                        });
                }
            });
});


module.exports = router;