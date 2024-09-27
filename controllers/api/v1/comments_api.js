// api/v1/comments_controller.js

const Comment = require('../../../models/comment');
const Post = require('../../../models/post');
const Like = require('../../../models/Like');
// Uncomment if you need to use the queue for email notifications
// const queue = require('../../../config/kue');
// const commentEmailWorker = require('../../../workers/comment_email_worker');

module.exports.create = async function(req, res) {
    try {
        // console.log("Create comment called");
        // console.log("Authenticated user:", req.user);
        // console.log("Post ID:", req.params.postId);
        // console.log("Comment data:", req.commentData);

        const postId = req.params.postId;
        const content = req.body.commentData;

        // Find the post to which the comment is to be added
        let post = await Post.findById(postId);

        if (post) {
            // Create the comment
            let comment = await Comment.create({
                content: content,
                post: postId,
                user: req.user._id
            });

            // Add the comment to the post's comments array
            post.comments.push(comment);
            await post.save();

            // Populate the user field in the comment
            await comment.populate('user', 'name email avatar');

            // Add a job to the queue for sending email notifications (if needed)
            // let job = queue.create('emails', comment).save(function(err) {
            //     if (err) {
            //         console.log('Error in creating a queue', err);
            //         return;
            //     }
            //     console.log('Job enqueued', job.id);
            // });

            return res.status(200).json({
                data: {
                    comment: comment
                },
                message: "Comment created successfully",
                notyText: 'Comment added!'
            });
        } else {
            return res.status(404).json({
                message: "Post not found"
            });
        }
    } catch (err) {
        console.log("Error while creating a new comment", err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

module.exports.destroy = async function(req, res) {
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId;

        // Find the comment to be deleted and populate its associated post
        let comment = await Comment.findById(commentId).populate('post');

        if (comment) {
            // Check if the user requesting deletion is the author of the comment or the post
            if (comment.user.equals(req.user._id) || comment.post.user.equals(req.user._id)) {
                // Delete all likes associated with the comment
                await Like.deleteMany({ likeable: comment._id, onModel: 'Comment' });

                // Delete the comment
                await comment.deleteOne();

                // Remove the comment from the post's comments array
                await Post.findByIdAndUpdate(postId, { $pull: { comments: commentId } });

                return res.status(200).json({
                    data: {
                        comment_id: commentId
                    },
                    message: "Comment deleted successfully",
                    notyText: 'Comment deleted'
                });
            } else {
                return res.status(401).json({
                    message: "Unauthorized to delete this comment"
                });
            }
        } else {
            return res.status(404).json({
                message: "Comment not found"
            });
        }
    } catch (err) {
        console.log("Error in deleting the comment", err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
