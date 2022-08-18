const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");

router.post("/:id", auth, async (req, res) => {
    try {
        const userId = req.user._id;

        const post = await Post.findById(req.params.id);

        if (post) {
            const foundLike = post.likes.find((post) => userId == post.userId);
            if (foundLike) {
                const id = post.likes.findIndex(
                    (post) => post.userId == userId
                );
                post.likes.splice(id, 1);
                await post.save();
                return res.json({
                    post,
                    message: "Post unliked",
                });
            }
            if (!foundLike) {
                post.likes.push({
                    userId,
                });
                await post.save();
                return res.json({
                    post,
                    message: "Post liked",
                });
            }
        }
    } catch (e) {
        return res.status(400).json({
            e,
            message: "Cannot like post",
        });
    }
});

module.exports = router;
