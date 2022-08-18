const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");

// get comment by id
// router.get("/", auth, async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const post = await Post.findById(req.params.id);
//         if(post)
//     } catch (e) {
//         return res.status(400).json({
//             e,
//             message: "Cannot get comments",
//         });
//     }
// });

// comment on post (input = postId, description, postId in url)
router.post("/:id", auth, async (req, res) => {
    try {
        const userId = req.user._id;

        // comment input
        const { description } = req.body;

        if (!description || description.length < 5)
            return res.json({
                message: "Comment must be at least 5 characters",
            });

        // find the post
        const post = await Post.findById(req.params.id);

        if (post) {
            post.comments.push({
                userId,
                description,
            });
            await post.save();
            return res.json({
                post,
                message: "Comment successful",
            });
        } else {
            return res.json({
                message: "Post does not exist",
            });
        }
    } catch (e) {
        return res.status(400).json({
            e,
            message: "Cannot comment on post",
        });
    }
});

// delete comment (input = commentId, postId in url)
router.delete("/:id", auth, async (req, res) => {
    try {
        const userId = req.user._id;
        const post = await Post.findById(req.params.id);

        const { commentId } = req.body;

        if (post) {
            const foundComment = post.comments.find(
                (comment) => comment._id == commentId
            );
            if (foundComment && foundComment.userId == userId) {
                // delete
                let id = post.comments.findIndex(
                    (comment) => comment._id == commentId
                );
                post.comments.splice(id, 1);
                await post.save();
                return res.json({
                    post,
                    message: "Comment deleted successfully",
                });
            } else {
                return res.json({
                    message: "You are not authorized to delete this comment",
                });
            }
        } else
            return res.json({
                messsage: "Post does not exist",
            });
    } catch (e) {
        return res.status(400).json({
            e,
            message: "Cannot delete comment",
        });
    }
});

// update comment (input = commentId, description, postId in url)
router.put("/:id", auth, async (req, res) => {
    try {
        const userId = req.user._id;
        const post = await Post.findById(req.params.id);

        const { commentId, description } = req.body;

        if (!description || description.length < 5)
            return res.json({
                message: "Comment must be at least 5 characters",
            });

        if (post) {
            const foundComment = post.comments.find(
                (comment) => comment._id == commentId
            );
            if (foundComment && foundComment.userId == userId) {
                foundComment.description = description;
                await post.save();
                return res.json({
                    post,
                    message: "Comment edited successfully",
                });
            } else {
                return res.json({
                    message: "You are not authorized to edit this comment",
                });
            }
        } else {
            return res.json({
                message: "Post does not exist",
            });
        }
    } catch (e) {
        return res.status(400).json({
            e,
            message: "Cannot edit comment",
        });
    }
});

module.exports = router;
