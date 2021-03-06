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
const removeProtocol = require('../../validation/social');

// @route    GET api/profile/test
// @desc     Tests POST route
// @access   Public
router.get('/test', (req, res) => res.json({msg: 'profile works'}));

// @route    GET api/profile
// @desc     Get current user's profile
// @access   Private
router.get(
    '/', 
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
router.get(
    '/user/:user_id', 
    (req, res) => {
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
router.get(
    '/all', 
    (req, res) => {
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
router.post(
    '/experience', 
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
            .catch(err => res.status(404).json({error: 'cannot find profile', system: err}));
    });

// @route    POST api/profile/education
// @desc     Add education to profile
// @access   Private
router.post(
    '/education', 
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
            .catch(err => console.log(err));
    });


// @route    GET api/profile/:handle
// @desc     Get profile by handle
// @access   Public
router.get(
    '/:handle', 
    (req, res) => {
    const errors = {}
    Profile.findOne({ handle: req.params.handle })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'There is no profile for this user'
                res.status(404).json(errors)
            } else {
                res.json(profile)
            }
        })
        .catch(err => res.status(404).json(err));
});


// @route    POST api/profile
// @desc     Create or edit user profile
// @access   Private
router.post(
    '/', 
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
        if(req.body.handle) profileFields.handle = req.body.handle; 
        if(req.body.company) profileFields.company = req.body.company; 
        if(req.body.website) profileFields.website = removeProtocol(req.body.website);  
        if(req.body.location) profileFields.location = req.body.location;  
        if(req.body.status) profileFields.status = req.body.status;  
        if(req.body.bio) profileFields.bio = req.body.bio;  
        if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;  

        // Skills - need to split into array
        if (typeof req.body.skills !== 'undefined') {
            profileFields.skills = req.body.skills.split(',');
        }

        // Social - need to initialize first since it's an object within an object
        // remove protocol from string to allow for more downstream flexibility + security
        profileFields.social = {};
        if (req.body.youtube) profileFields.social.youtube = removeProtocol(req.body.youtube);
        if (req.body.twitter) profileFields.social.twitter = removeProtocol(req.body.twitter);
        if (req.body.facebook) profileFields.social.facebook = removeProtocol(req.body.facebook);
        if (req.body.linkedin) profileFields.social.linkedin = removeProtocol(req.body.linkedin);
        if (req.body.instagram) profileFields.social.instagram = removeProtocol(req.body.instagram);

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
            }) 
            .catch(err => res.status(404).json({error: 'No profile found for that user', system: err}));
});

// @route    DEL api/profile/experience/:exp_id
// @desc     delete experience from profile
// @access   Private
router.delete(
    '/experience/:exp_id', 
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Profile.findOne({ user: req.user.id })
            .then(profile => {
                // map over experience array to grab ids
                // store the one that matches with req param id
                const removeIndex = profile.experience
                    .map(item => item.id)
                    .indexOf(req.params.exp_id)
                
                // splice out the experience with index found above
                profile.experience.splice(removeIndex, 1)

                // save the changes to the profile, then send it back
                profile.save().then(profile => res.json(profile))
            })
            .catch(err => res.status(404).json(err));
        }
);

// @route    DEL api/profile/education/:edu_id
// @desc     delete education from profile
// @access   Private
router.delete(
    '/education/:edu_id', 
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Profile.findOne({ user: req.user.id })
            .then(profile => {
                // map over experience array to grab ids
                // store the one that matches with req param id
                const removeIndex = profile.education
                    .map(item => item.id)
                    .indexOf(req.params.edu_id)
                
                // splice out the experience with index found above
                profile.education.splice(removeIndex, 1)

                // save the changes to the profile, then send it back
                profile.save().then(profile => res.json(profile))
            })
            .catch(err => res.status(404).json(err));
        }
);

// @route    DEL api/profile
// @desc     delete user and profile
// @access   Private
router.delete(
    '/', 
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Profile.findOneAndRemove({ user: req.user.id })
        .then(() => {
            User.findOneAndRemove({ _id: req.user.id })
            .then(() => {
                res.json({ success: true })
            })
        })
        .catch(err => res.status(404).json(err))
    }
);

module.exports = router;