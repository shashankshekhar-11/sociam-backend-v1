//importing posts schema module
const Post=require('../../../models/post');
//importing comments schema module
const Comment=require('../../../models/comment');

module.exports.getPost = async function(req, res) {
    try {
        let post = await Post.findById(req.params.id)
            .populate('user', '-password')
            .populate({
                path: 'comments',
                options: { sort: { 'createdAt': -1 } },
                populate: {
                    path: 'user',
                    select: '-password'
                }
            });

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        res.status(200).json({
            message: "Post retrieved successfully",
            post: post
        });
    } catch (err) {
        console.log("Error Occured", err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

//making the controller for the post api request
module.exports.index=async function(req,res){
    try{
        let posts=await Post.find({}).
        sort('createdAt'). //decending order of creation for ascending sor('createdAt')
        populate('user','-password').   //first field to populate
        populate({          //another field to populate
            path:'comments',
            options: { sort: { 'createdAt': -1 } }, //sort the comments in reverse order
            populate:{      //multi-level populate
                path:'user',
                select:'-password'
            }
        });
        res.status(200).json({
            message:"List of Posts",
            posts:posts
        })
    }catch(err){
        console.log("Error Occured", err);
    }
}

//making the controller for the post api delete request
module.exports.destroy=function(req,res){
    // console.log("here to delete");
    Post.findById(req.params.id.trim())
    .then((post)=>{
        //if the user of post and user requested to delete are same(already taken care by mw)
        if(post.user==req.user.id){
            //remove the post
            post.deleteOne()
            //remove all the comments associated with the post
            .then(()=>{Comment.deleteMany({post:req.params.id})})
            .then((comment)=>{
                // console.log("Deleted the Post & associated comments");
                return res.status(200).json({
                    data:{
                        post_id:req.params.id.trim()
                    },
                    message:"Post Deleted",
                    notyText:'Post and Associated Comments Deleted!!'
                })
            })
            .catch((err)=>{
                // console.log("Not the genuine user to delete comment"+err);
                return res.status(500).json({
                    message:"Internal Server Error"
                })
            })
        }else{
            req.flash('error','Unable to delete the post');
            return res.status(401).json({
                message:"unauthorised to delete the post"
            });
        }
    }).catch((err)=>{
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error"
        })
    })
}

//making the posts controller
module.exports.create=function(req,res){
    // console.log("Reaching or not"+req);
    Post.create({
        content:req.body.content,
        user: req.body.user
    }).then(async function(post){
        //populating the user field before sending
        await post.populate('user','name email avatar'); //populate only Field Selection so, second argument to the populate method
        return res.status(200).json({
            post:post,
            message:"Post Created",
            notyText:'Post Published!!'
        })
    }).catch((err)=>{
        req.flash('error','Error Creating the post');
        console.log("error in creating the post");
        return res.status(500).json({ error: err.message });
    })
}
//edit post
module.exports.editPost = async function(req, res) {
    try {
        // Extract post ID and new content from the request
        // console.log("Request Body", req.body);
        const { _id, content } = req.body;

        // Find the post by ID
        let post = await Post.findById(_id);

        // Check if the post exists
        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // Check if the user making the request is the owner of the post
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                message: "Unauthorized to edit this post"
            });
        }

        // Update the post content
        post.content = content;

        // Save the changes to the database
        await post.save();

        // Populate user details to send the updated post back
        await post.populate('user', 'name email avatar');

        return res.status(200).json({
            message: "Post updated successfully",
            post: post
        });

    } catch (err) {
        console.log("Error Occurred", err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}