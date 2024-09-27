// controllers/api/v1/users_api.js

const Like = require('../../../models/Like');
const User = require('../../../models/user');
const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.toggleBookmark = async function(req, res) {
    try {
        // Extract postId from req.body.postId
        const postId = req.body.postId;
        const userId = req.user._id;
        let notyText;
        let deleted = false; // Indicates whether the bookmark was removed

        // Validate that postId is provided
        if (!postId) {
            return res.status(400).json({
                message: 'postId is required',
                notyText: 'postId is required'
            });
        }

        // Find the user
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                notyText: 'User not found'
            });
        }

        // Check if the post exists
        let post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                notyText: 'Post not found'
            });
        }

        // Check if postId is in user's bookmarks
        const index = user.bookmarks.indexOf(postId);

        if (index === -1) {
            // Not bookmarked, add it
            user.bookmarks.push(postId);
            notyText = 'Bookmark added successfully';
            // console.log('Bookmark added!');
        } else {
            // Already bookmarked, remove it
            user.bookmarks.splice(index, 1);
            notyText = 'Bookmark removed successfully';
            deleted = true;
            // console.log('Bookmark removed!');
        }

        // Save the user
        await user.save();

        // Optionally, populate the bookmarks array
        // await user.populate('bookmarks', 'content user');

        // Return response
        return res.status(200).json({
            message: notyText,
            notyText: notyText,
            data: {
                user_id: userId,
                post_id: postId,
                deleted: deleted
            }
        });
    } catch (err) {
        console.log('Error in toggling the bookmark', err);
        return res.status(500).json({
            message: 'Internal Server Error',
            notyText: 'Internal Server Error'
        });
    }
};
