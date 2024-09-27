//include the mongoose
const mongoose=require('mongoose');

const friendshipSchema=new mongoose.Schema({
    //user who set this request
    from_user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    to_user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps:true
});

const Friendship=mongoose.model('Friendship',friendshipSchema);
module.exports=Friendship;