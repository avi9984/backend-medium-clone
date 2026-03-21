import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken.js';
import { sendEmail } from '../utils/sendEmail.js';
import crypto from 'crypto';


//? Register User function

const register = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        if (!(username && password && email)) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "Email is already exist, Plz login now" })
        }
        let hasPassword = await bcrypt.hash(password, 10)
        const obj = {
            username,
            password: hasPassword,
            email: email.toLowerCase()
        }
        await User.create(obj);
        return res.status(201).json({
            message: "User Register Successfully",
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

//? Login User function 

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            return res.status(400).json({ message: "Email and password is required" });

        }
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credencails" })
        }
        const checkPass = await bcrypt.compare(password, user.password);
        if (!checkPass) {
            return res.status(400).json({ message: "Invalid credencails" })
        }
        user.lastlogin = new Date();
        await user.save();

        return res.status(200).json({
            status: true,
            message: "User login successfully",
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user)
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error?.message });
    }
}


//! Get login User profile function

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userAuth.id).select("-password");

        delete user.password

        return res.status(200).json({
            status: true,
            message: "Get User profile",
            user
        })
    } catch (error) {
        console.log(error);

    }
}


const blockUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const userToBlock = await User.findById(userId);
        if (!userToBlock) {
            return res.status(404).json({ message: "User not found" });
        }

        //? Check current user id
        const userBloking = req?.userAuth?._id;
        if (userBloking.toString() === userId.toString()) {
            return res.status(400).json({ message: "You cannot block yourself" });
        }

        const currentUser = await User.findById(userBloking);
        //  if(currentUser.role !== "admin"){
        //     return res.status(403).json({ message: "You are not authorized to block user" });
        //  }

        //check user is already blocked or not
        if (currentUser.blockedUsers.includes(userId)) {
            return res.status(400).json({ message: "User is already blocked" });
        }

        currentUser.blockedUsers.push(userId);
        await currentUser.save();
        return res.status(200).json({ message: "User blocked successfully" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const unblockUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const userToUnblock = await User.findById(userId);
        if (!userToUnblock) {
            return res.status(404).json({ message: "User not found" });
        }

        //? Check current user id
        const userUnblocking = req?.userAuth?._id;
        if (userUnblocking.toString() === userId.toString()) {
            return res.status(400).json({ message: "You cannot unblock yourself" });
        }

        const currentUser = await User.findById(userUnblocking);
        //  if(currentUser.role !== "admin"){
        //     return res.status(403).json({ message: "You are not authorized to unblock user" });
        //  }

        //check user is already unblocked or not
        if (!currentUser.blockedUsers.includes(userId)) {
            return res.status(400).json({ message: "User is already unblocked" });
        }

        currentUser.blockedUsers.pull(userId);
        await currentUser.save();
        return res.status(200).json({ message: "User unblocked successfully" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


//? View another user profile

const viewOtherUserProfile = async (req, res) => {
    try {
        const userProfileId = req.params.id;
        const userProfile = await User.findById(userProfileId);
        if (!userProfile) {
            return res.status(404).json({ message: "User not found" });
        }
        const currentUserId = req.userAuth._id;
        if (userProfile.profileViewers.includes(currentUserId)) {
            return res.status(403).json({ message: "You are already viewed this profile" });
        }
        if (userProfile.blockedUsers.includes(currentUserId)) {
            return res.status(403).json({ message: "You are blocked by this user" });
        }
        userProfile.profileViewers.push(currentUserId);
        await userProfile.save();
        return res.status(200).json({
            status: true,
            message: "User profile",
            userProfile
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


//? Follow user function

const followUser = async (req, res) => {
    try {
        const userToFollowId = req.params.id;
        const userToFollow = await User.findById(userToFollowId).select("-password");
        if (!userToFollow) {
            return res.status(404).json({ message: "User not found" });
        }
        const currentUserId = req.userAuth._id;

        if (userToFollow.followers.includes(currentUserId)) {
            return res.status(403).json({ message: "You are already following this user" });
        }


        if (userToFollow.blockedUsers.includes(currentUserId)) {
            return res.status(403).json({ message: "You are blocked by this user" });
        }
        // current user not follow himself
        if (userToFollowId.toString() === currentUserId.toString()) {
            return res.status(403).json({ message: "You cannot follow yourself" });
        }

        await User.findByIdAndUpdate(
            userToFollowId,
            {
                $addToSet: {
                    followers: currentUserId
                },
            },
            { returnDocument: "after" }
        )

        await User.findByIdAndUpdate(
            currentUserId,
            {
                $addToSet: {
                    following: userToFollowId
                }
            },
            { returnDocument: "after" }
        )

        return res.status(200).json({
            status: true,
            message: "You have followed user successfully",
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


//? Unfollow user function

const unfollowUser = async (req, res) => {
    try {
        const userToUnfollowId = req.params.id;
        const userToUnfollow = await User.findById(userToUnfollowId).select("-password");
        if (!userToUnfollow) {
            return res.status(404).json({ message: "User not found" });
        }
        const currentUserId = req.userAuth._id;

        if (!userToUnfollow.followers.includes(currentUserId)) {
            return res.status(403).json({ message: "You are not following this user" });
        }


        if (userToUnfollow.blockedUsers.includes(currentUserId)) {
            return res.status(403).json({ message: "You are blocked by this user" });
        }
        // current user not unfollow himself
        if (userToUnfollowId.toString() === currentUserId.toString()) {
            return res.status(403).json({ message: "You cannot unfollow yourself" });
        }

        await User.findByIdAndUpdate(
            userToUnfollowId,
            {
                $pull: {
                    followers: currentUserId
                },
            },
            { returnDocument: "after" },
            { new: true }
        )

        await User.findByIdAndUpdate(
            currentUserId,
            {
                $pull: {
                    following: userToUnfollowId
                }
            },
            { returnDocument: "after" },
            { new: true }
        )

        return res.status(200).json({
            status: true,
            message: "You have unfollowed user successfully",
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//? Forgot password function

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "This email not registered" });
        }
        const resetToken = user.resetPasswordToken();
        console.log("resetToken", resetToken);

        await user.save();
        // send mail to user
        sendEmail(email, resetToken, user.username)

        return res.status(200).json({
            status: true,
            message: "Reset token sent successfully",
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


//? Reset password function

const resetPassword = async (req, res) => {
    try {
        const resetToken = req.params.token;
        const { password } = req.body;

        //convert token into hash token
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });
        if (!user) {
            return res.status(404).json({ message: "Invalid token" });
        }
        // hash password

        user.password = await bcrypt.hash(password, 10);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        return res.status(200).json({
            status: true,
            message: "Password reset successfully",
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export { register, loginUser, getUserProfile, blockUser, unblockUser, viewOtherUserProfile, followUser, unfollowUser, forgotPassword, resetPassword }