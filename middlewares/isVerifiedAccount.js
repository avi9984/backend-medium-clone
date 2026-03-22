import User from '../models/user.js';

const isVerifiedAccount = async (req, res, next) => {
    try {

        const currentUser = await User.findById(req.userAuth._id)
        if (currentUser.isVerified) {
            next()
        } else {
            return res.status(401).json({ message: "Account is not verified" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message })
    }
}

export default isVerifiedAccount;