const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");

// Add post to localhost:3000/posts
/*
router.post("/", auth, (req, res) => {
    const {title, description} = req.body;
    const post = new Post({title, description, author: req.user.id});
    post.save();
    return res.json({message: "Post added successfully", post});
});
*/
router.post("/", auth, async (req, res) => {
    try {
        const { title, description } = await req.body;
        const post = await new Post({
            title,
            description,
            author: req.user._id,
        });
        post.save();
        return res.json({
            message: "Post added successfully",
            post,
        });
    } catch (e) {
        return res.json({
            e,
            message: "Failed to add post",
        });
    }
});

// Get all posts from localhost:3000/posts
router.get("/", async (req, res) => {
    try {
        let posts = await Post.find({});
        if (!posts.length)
            return res.json({
                message: "No posts found",
            });
        return res.json(posts);
    } catch (e) {
        return res.json({
            e,
            message: "Failed to get posts",
        });
    }
});

// Get post by id from localhost:3000/posts/id
router.get("/:id", async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        return res.json(post);
    } catch (e) {
        return res.json({
            e,
            message: "Post ID does not exist",
        });
    }
});

// Delete post by id from localhost:3000/posts/id
router.delete("/:id", auth, async (req, res) => {
    try {
        let checkAuth = await Post.findById(req.params.id);
        if (checkAuth.author != req.user._id)
            return res.json({
                message: "Unauthorized",
            });
        let post = await Post.findByIdAndDelete(req.params.id);
        return res.json({ post, message: "Post successfully deleted" });
    } catch (e) {
        return res.json({
            e,
            message: "Post ID does not exist",
        });
    }
});

// Update post by id from localhost:3000/posts/id
router.put("/:id", auth, async (req, res) => {
    try {
        let checkAuth = await Post.findById(req.params.id);
        if (checkAuth.author != req.user._id)
            return res.json({
                message: "Unauthorized",
            });
        let post = await Post.findByIdAndUpdate(req.params.id, req.body);
        return res.json({
            post,
            message: "Successfully updated post",
        });
    } catch (e) {
        return res.json({
            e,
            message: "Post ID does not exist",
        });
    }
});

module.exports = router;
