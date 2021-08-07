const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');

//Update 

router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id) {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            },{new: true});
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(401).json("You can update only your account!");
    }
    
});

//Get Posts by Category

router.get('/:id', async (req, res) => {
    try {
        const posts = await Post.find({category: req.params.id});
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Get All Posts By Id

router.get("/", async (req, res) => {
    const username = req.query.user;
    if (username) {
        try {
            let posts = await Post.find({username: username});
    
            res.status(200).json(posts);
        } catch (error) {
            res.status(500).json(error);
        }
    }
});

router.get("/singleUser/:id", async (req, res) => {
    const id = req.params.id;
    if (id) {
        try {
            let user = await User.findById(id);
    
            res.status(200).json(user.profilePhoto);
        } catch (error) {
            res.status(500).json(error);
        }
    }
});

module.exports = router;