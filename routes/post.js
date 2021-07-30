const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

//Post

router.post("/", async (req, res) => {
    const user = await User.findById(req.body.userId);
    if (user) {
        const newPost = new Post({
            username: user.username,
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            photo: req.body.photo
        });
        try {
            const savePost = await newPost.save();
    
            res.status(200).json(savePost);
        } catch (error) {
            res.status(500).json(error);
        }
    }
});

//Update 

router.put("/:id", async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, {new: true});
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Delete 

router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.username === req.body.username) {
            try {
                await post.delete();
                res.status(200).json("Post has been deleted!");
            } catch (error) {
                res.status(500).json(error);
            }
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

//Delete All Posts 

router.delete("/", async (req, res) => {
    const user = await User.findById(req.query.userId);
    if (user) {
        try {
            await Post.deleteMany({username: user.username});
            res.status(200).json("Posts have been deleted!");
        } catch(error) {
            res.status(500).json(error);
        }
    }
});

//Get 

router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Get All Posts

router.get("/", async (req, res) => {
    try {
        let posts = await Post.find();

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }
});


module.exports = router;