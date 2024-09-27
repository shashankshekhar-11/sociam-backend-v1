// api/v1/comments.js

const passport = require('passport');
const express = require('express');
const router = express.Router();

const commentsController = require('../../../controllers/api/v1/comments_api');

// Route to create a comment (only available when the user is signed in)
// Endpoint: POST /api/v1/comments/create/:postId
router.post('/create/:postId', passport.authenticate('jwt', { session: false }), commentsController.create);

// Route to delete a comment (authentication required)
// Endpoint: POST /api/v1/comments/destroy/:postId/:commentId
router.post('/destroy/:postId/:commentId', passport.authenticate('jwt', { session: false }), commentsController.destroy);

module.exports = router;
