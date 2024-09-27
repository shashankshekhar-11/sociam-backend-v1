//creating the post schema for our Social Media WebApp
const mongoose=require('mongoose');
//creating a schema
const postSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    user:{      //refer to a user schema
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    //change here(to keep the hybrid connection between comment and posts for fast fetching)
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }],
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Like'
    }]
},{
    timestamps:true
});

const Post=mongoose.model('Post', postSchema);
module.exports= Post;