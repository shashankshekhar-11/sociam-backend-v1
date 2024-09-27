//require the Express Module
const express=require('express');
//creating the instance of the router(help to separate route and controller)
const router=express.Router();
//importing the passport module
const passport=require('passport');

//importing the controller
const toggleLikeApi=require('../../../controllers/api/v1/toggleLike');

router.get('/toggle', function(req, res, next) {
    // console.log('Received toggle request');
    next();
}, passport.authenticate('jwt', {session:false}), toggleLikeApi.toggleLike);

// router.get('/toggle', passport.authenticate('jwt',{session:false}), toggleLikeApi.toggleLike);
//making this file available for the index.js(or all)
module.exports=router;