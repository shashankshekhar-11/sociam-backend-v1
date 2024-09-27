//importing the mongoose module
const mongoose=require('mongoose');

const likeSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    likable:{   //on (object on which Like was placed)
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        refPath:'onModel'
    },
    onModel:{   //type of liked object dynamically can take
        type:String,
        required:true,
        enum:['Post','Comment'] //set of values it can take in mongoose
    }
},{
    timestamps:true
});

//creating the model
const Like=mongoose.model('Like',likeSchema);
//exporting the model for creating the Like Document
module.exports=Like;