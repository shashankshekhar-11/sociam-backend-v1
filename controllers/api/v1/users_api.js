//importing the jsonwebtoken module used to generate the jwt token
const jwt= require('jsonwebtoken');
const User=require('../../../models/user');
const Friendship=require('../../../models/friendship');
const env=require('../../../config/environment');

module.exports.createSession = async function(req, res) {
    try {
        let user = await User.findOne({ email: req.body.email }).populate('friendships');
        
        if (!user || user.password !== req.body.password) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }
        let foundUser=user.toObject();
        delete foundUser.password;
        const token = jwt.sign(user.toJSON(), env.jwt_secret_key, { expiresIn: '86400000' });
        // console.log(token);
        return res.status(200).json({
            message: 'Sign-in successful, JWT token generated',
            foundUser: foundUser,
            encodedToken: token
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

// create the user
module.exports.create = function(req, res) {
    // TODO: Add necessary validations and checks
    
    // Check if the password and confirm password match
    if (req.body.confirmPassword !== req.body.password) {
        return res.status(303).json({
            message: "Confirm Password didn't matched",
        });
    }

    // Check if the email already exists
    User.findOne({ email: req.body.email })
        .then((oldUser) => {
            if (!oldUser) {
                // All tests passed, store the data
                User.create(req.body)
                    .then((newUser) => {
                        if (newUser) {
                            // console.log("Added the NewUser Successfully!");
                            const token = jwt.sign(newUser.toJSON(), env.jwt_secret_key, { expiresIn: '100000' });
                            return res.status(201).json({
                                message:"Added the NewUser Successfully!",
                                createdUser: newUser,
                                encodedToken: token
                            });
                        }
                    })
                    .catch((err) => {
                        console.error("Error in creating the new User:", err);
                        return res.status(500).json({
                            error: "Error in creating the new User",
                        });
                    });
            } else {
                return res.status(422).json({
                    errors: ["Unprocessable Entity. Username Already Exists."],
                });
            }
        })
        .catch((err) => {
            console.error("Error in fetching the existing email:", err);
            return res.status(500).json({
                error: "Internal Server Error",
            });
        });
};


module.exports.getAllUsers=async function(req,res){
    try {
        const users = await User.find({}).select('name email avatar');
        return res.status(200).json({ users: users });
    } catch (err) {
        console.error("Error in fetching all users:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
//toggle friendship
module.exports.toggleFriendship = async function(req, res) {
    try {
        const userId = req.user._id;       // Authenticated user's ID
        const friendId = req.params.id;    // ID of the user to be friended/unfriended

        if (userId.equals(friendId)) {
            return res.status(400).json({
                message: "You cannot befriend yourself",
                notyText: "You cannot befriend yourself"
            });
        }

        // Check if a friendship already exists
        let existingFriendship = await Friendship.findOne({
            $or: [
                { from_user: userId, to_user: friendId },
                { from_user: friendId, to_user: userId }
            ]
        });

        let areFriends;
        let notyText;

        if (existingFriendship) {
            // Friendship exists, so remove it
            await User.findByIdAndUpdate(userId, { $pull: { friendships: existingFriendship._id } });
            await User.findByIdAndUpdate(friendId, { $pull: { friendships: existingFriendship._id } });
            await existingFriendship.deleteOne();

            areFriends = false;
            notyText = "Friendship removed";
        } else {
            // Create a new friendship
            let newFriendship = await Friendship.create({
                from_user: userId,
                to_user: friendId
            });

            await User.findByIdAndUpdate(userId, { $push: { friendships: newFriendship._id } });
            await User.findByIdAndUpdate(friendId, { $push: { friendships: newFriendship._id } });

            areFriends = true;
            notyText = "Friendship added";
        }

        return res.status(200).json({
            message: notyText,
            notyText: notyText,
            data: {
                areFriends: areFriends
            }
        });
    } catch (err) {
        console.error("Error in toggling friendship:", err);
        return res.status(500).json({
            message: "Internal Server Error",
            notyText: "Internal Server Error"
        });
    }
};

// Edit user details
module.exports.editUser = async function (req, res) {
    try {
        const userId = req.user._id; // Authenticated user's ID
        const { name, email, password, avatar } = req.body; // Data to update
        // console.log("Request Body", req.body);
        // Find the user and update the details
        let updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    name: name,
                    email: email,
                    password: password,
                    avatar: avatar // Update avatar if provided
                }
            },
            { new: true } // Return the updated user
        );

        // If no user is found
        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Respond with the updated user data (excluding password)
        let userResponse = updatedUser.toObject();
        delete userResponse.password;

        return res.status(200).json({
            message: "User updated successfully",
            user: userResponse
        });

    } catch (err) {
        console.error("Error in updating user:", err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
