//importing the express module
const express = require('express');
//assigning the port number
const port = 8000;
//importing the path for development independent path
const path = require('path');
//importing body-parser for decoding the form payload (POST data)
const bodyParser = require('body-parser');
//importing cookie-parser for using cookie
const cookieParser = require('cookie-parser');
//for Cross-origin resource sharing
const cors = require('cors');

//creating the instance of the express
const app = express();
app.use(cors()); //for cross origin resource sharing

//importing the mongoDB settings
const db = require('./config/mongoose');

//importing passport for authentication
const passport = require('passport');
//importing the JWT strategy for API authentication
require('./config/passport-jwt-strategy');

//using the body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//middleware to transfer requests to the routes/index.js
app.use('/', require('./routes/index'));

//firing up the server
app.listen(port, function (err) {
    if (err) {
        console.log(`Error in firing the server ${err}`);
    }
    console.log(`Server is up at port: ${port}`);
});
