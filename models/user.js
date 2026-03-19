import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, lowerCase: true, unique: true },
    role: { type: String, required: true, enum: ["user", "admin"], default: "user" },
    password: { type: String, required: true, minLength: 8, select: false },
    lastlogin: { type: Date, default: Date.now() },
    isVerified: { type: Boolean, default: false },
    accountLevel: { type: String, enum: ["bronze", "silver", "gold"], default: "bronze" },
    profilePicture: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    bio: { type: String },
    location: { type: String },
    notificationType: {
        email: { type: String, required: false }
    },
    gender: { type: String, enum: ["male", "female", "I'm not answer", "non-binary"] },

    profileViewers: [{ type: ObjectId, ref: 'User' }],
    followers: [{ type: ObjectId, ref: 'User' }],
    following: [{ type: ObjectId, ref: 'User' }],
    blockedUsers: [{ type: ObjectId, ref: 'User' }],
    posts: [{ type: ObjectId, ref: 'Post' }],
    likedPosts: [{ type: ObjectId, ref: 'Post' }],
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    accountVerificationToken: { type: String },
    accountVerificationExpires: { type: Date }
}, { timestamps: true, versionKey: false });


const User = mongoose.model("User", userSchema);
export default User;