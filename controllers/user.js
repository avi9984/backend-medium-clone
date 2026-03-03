import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken.js';

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


export { register, loginUser, getUserProfile }