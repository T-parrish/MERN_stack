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
const validateCommentInput = require('../../validation/comment');


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
// @desc     likes a post if unliked, unlikes a post if liked
// @access   Private
router.post(
    '/like/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Post.findOne({ _id: req.params.id})
            .then(post => {
                const indexOfUser = post.likes.findIndex(like => like.user.toString() === req.user.id);
                indexOfUser === -1 ? post.likes.push({ user: req.user.id }) : post.likes.pop({ user: req.user.id })

                post.save().then(post => res.json(post))
            })
            .catch(err => res.status(404).json({ postNotFound : 'No post found with this id'}))
    }
);

// @route    POST api/posts/comment/:id
// @desc     Comments on a post
// @access   Private
router.post(
    '/comment/:id', 
    passport.authenticate('jwt', {session: false}), 
    (req, res) => {
        const { errors, isValid } = validateCommentInput(req.body)

        if(!isValid) {
            return res.status(400).json({ errors })
        };

        Post.findById(req.params.id)
            .then(post => {
                const newComment = {
                    text: req.body.text,
                    name: req.body.name,
                    avatar: req.body.avatar,
                    user: req.user.id
                }
                post.comments.push(newComment)
                post.save().then(post => res.json(post))
            })
            .catch(err => res.status(404).json({ postNotFound : 'No post found with this id'}))
    }
);

// @route    DELETE api/posts/comment/:id
// @desc     Deletes a comment from a post
// @access   Private
router.delete(
    '/comment/:id/:comment_id', 
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        Post.findById(req.params.id)
            .then(post => {
                // for each comment in comments, filter to _id and check 
                // to see if it matches the comment_id from url params
                if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
                    return res.status(404).json({ noComment:'Comment not found'})
                } 
                
                // if there is a match between url params and post comments
                // map the comments to _id strings and grab the matching index
                const removeIndex = post.comments
                    .map(item => item._id.toString())
                    .indexOf(req.params.comment_id)
                
                // Server side validation to make sure that people can only delete
                // their own comments, not log into postman and cause havoc
                if (req.user.id !== post.comments[removeIndex].user.toString()) {
                    return res.status(401).json({ notauthorized: "User not authorized" });
                }
                
                // splice out the comment at the matching index
                post.comments.splice(removeIndex, 1)

                // save and return the json response
                post.save().then(post => res.json(post))
            })
            .catch(err => res.json({noPost: 'no post found', system: err}));
    }

);



module.exports = router;