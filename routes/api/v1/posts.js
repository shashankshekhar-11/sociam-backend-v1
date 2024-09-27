//importing passport module to check authentication of api as middleware
const passport=require('passport');
//import the express module
const express=require('express');
//createing instance router that help to separate the route & controller
const router=express.Router();

const postApi=require('../../../controllers/api/v1/posts_api');

router.get('/:id',postApi.getPost);
//post feature only available when the user is signed in
router.post('/create',passport.authenticate('jwt',{session:false}), postApi.create);

//Authentication
router.delete('/destroy/:id',passport.authenticate('jwt',{session:false}),postApi.destroy); //prevent session cookie to be generated

router.post('/edit', passport.authenticate('jwt', { session: false }), postApi.editPost);

//if only request
router.get('/',postApi.index);


//exporting router config to all files so that index.js(of v1) can use it
module.exports=router;