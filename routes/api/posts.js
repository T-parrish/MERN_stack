const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load models
const Post = require('../../models/Posts');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// Validators
const validatePostInput = require('../../validation/post');


// @route    GET api/posts/test
// @desc     Tests POST route
// @access   Public
router.get('/test', (req, res) => res.json({msg: 'posts work'}));

// @route    GET api/posts
// @desc     Get all posts
// @access   Public
router.get('/', (req, res) => {
    Post.find()
        // sorts by newest posts first
        .sort({date: -1})
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json(err));
});

// @route    GET api/posts/:id
// @desc     Get post by id
// @access   Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({ noPostFound: 'No post found with that id' }));
});

// @route    POST api/posts
// @desc     Create a post
// @access   Private
router.post(
    '/', 
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        const { errors, isValid } = validatePostInput(req.body)

        if(!isValid) {
            return res.status(400).json({ noPostsFound: 'No posts found'})
        };

        const newPost = new Post ({
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.user.id
        });
        newPost.save().then(post => res.json(post))
    }
);

// @route    DEL api/posts/:id
// @desc     delete post by id
// @access   Private
router.delete(
    '/:id', 
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        // Find and delete the post that matches input id and auth user id
        Post.findOneAndDelete({_id: req.params.id, user: req.user.id})
            .then(posts => {
                if(posts !== null) {
                    res.json({ success: 'post deleted' })
                } else {
                    res.status(400).json({ noPost : 'no post found with that id'})
                }
            })
            .catch(err => res.status(404).json(err));
        }
);

// @route    POST api/posts/like/:id
// @desc     likes a post
// @access   Private
router.post(
    '/like/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Post.findOne({ _id: req.params.id, user: req.user.id })
            .then(post => {
                if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                    return res.status(400).json({ alreadyLiked : 'User already liked this post'})
                }

                post.likes.push({ user: req.user.id })

                post.save().then(post => res.json(post))
            })
            .catch(err => res.status(404).json({ postNotFound : 'No post found with this id'}))
    }
);


module.exports = router;