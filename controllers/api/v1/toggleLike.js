//importing Like model to toggle the like
const Like=require('../../../models/Like');
//also have to modification in the post and comments
const Post=require('../../../models/post');
const Comment=require('../../../models/comment');

module.exports.toggleLike=async function(req,res){
    try{    //link:likes/toggle/?id=abcdef&type=Post/Comment
        // console.log("on like handler via api");
        let likable;
        let deleted=false;  //for purpose of increment and decrement
        let notyText;
        if(req.query.type=="Post"){ //if post
            likable=await Post.findById(req.query.id).populate('likes');
        }else{  //if comment
            likable=await Comment.findById(req.query.id).populate('likes');
        }
        // console.log(likable);
        let existingLike=await Like.findOne({user:req.user.id.trim(), likable:likable._id,onModel:req.query.type});
        // console.log(existingLike+"Existing Like");
        if(existingLike){   //if the like already exits
            likable.likes.pull(existingLike._id);
            // console.log(req.user._id+" vs "+req.user.id);
            likable.save();
            deleted=true;
            existingLike.deleteOne();
            console.log("Deleted!");
            notyText=`Removed like from the ${req.query.type}`;
        }else{  //making a new like
            let newLike=await Like.create({
                user:req.user._id,
                likable:likable._id,    //req.query.id i.e,here later likable is post/comment
                onModel:req.query.type
            })
            // console.log("New Like Created"+newLike);
            likable.likes.push(newLike._id);
            notyText=`Liked the ${req.query.type}`;
            likable.save();
        }
        //after all successful
        return res.status(200).json({
            message:notyText,
            notyText:notyText,
            data:{
                _id:likable._id,
                user_id:req.user._id,
                deleted:deleted
            }
        })

    }catch(err){
        console.log("Error in toggling the like"+err);
        return res.status(500).json({
            message:"Internal Server Error",
            notyText:"Internal Server Error"
        })
    }
}
