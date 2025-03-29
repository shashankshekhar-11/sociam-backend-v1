//importing mongoose module
const mongoose=require('mongoose');

//connecting to the mongoDB
mongoose.connect(`mongodb+srv://shashankshekhar746:<db_password>@sociam-v1.dt3odfl.mongodb.net/`);

//acquring the connection
const db=mongoose.connection;

db.on('error',console.error.bind(console,'Error connecting to db'));
db.once('open',function(){
    console.log('connected to Database:: MongoDB');
});

module.exports=db;
