//importing mongoose module
const mongoose=require('mongoose');

//connecting to the mongoDB
mongoose.connect(`mongodb+srv://sociam1:sociam1@cluster0.aqcrn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);

//acquring the connection
const db=mongoose.connection;

db.on('error',console.error.bind(console,'Error connecting to db'));
db.once('open',function(){
    console.log('connected to Database:: MongoDB');
});

module.exports=db;