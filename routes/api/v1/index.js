//import the express module
const express=require('express');
//createing instance router that help to separate the route & controller
const router=express.Router();

//router for the api/v1/posts requests
router.use('/posts',require('./posts'));
//router for the api/v1/users requests
router.use('/users',require('./users'));
//router for the api/v1/likes requests
router.use('/likes',require('./likes'));
//router for the api/v1/bookmarks requests
router.use('/bookmarks',require('./bookmarks'));
//router for the api/v1/likes requests
router.use('/comments',require('./comments'));


//exporting router config to all files so that index.js(of api) can use it
module.exports=router;