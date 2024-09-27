//import the express module
const express=require('express');
//createing instance router that help to separate the route & controller
const router=express.Router();

//router for the api requests
router.use('/api',require('./api'));

//exporting router config to all files so that index.js(parent) can use it
module.exports=router;