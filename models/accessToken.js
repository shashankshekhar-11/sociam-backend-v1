//creating the user Schema for access Token
//importing the mongoose
const mongoose=require('mongoose');

//creating the schema
const accessTokenSchema=new mongoose.Schema({
    accessToken:{
        type:String,
        required:true,
        unique:true
    },
    user:{      //refer to a user schema
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    isValid:{
        type:Boolean,
        required:true
    },
},{
    timestamps:true
});

// creating the model
const AccessToken=mongoose.model('AccessToken', accessTokenSchema);
//exporting the model
module.exports=AccessToken;