//require the Express Module
const express=require('express');
//creating the instance of the router(help to separate route and controller)
const router=express.Router();
//importing the passport module
const passport=require('passport');

//importing the controller
const toggleBookmarkApi=require('../../../controllers/api/v1/toggleBookmark');

// Route for toggling bookmark
router.post('/toggle-bookmark', passport.authenticate('jwt', { session: false }), toggleBookmarkApi.toggleBookmark);

module.exports=router;