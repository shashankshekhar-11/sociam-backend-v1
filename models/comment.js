//include the mongoose
const mongoose=require('mongoose');

//creating the schema
const commentSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    //comment belongs to the user
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    //comment also belong to a post
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Like'
    }]
},{
    timestamps: true
})

//creating the model
const Comment=mongoose.model('Comment', commentSchema);
//exporting the model
module.exports =Comment;