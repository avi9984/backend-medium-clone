import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const isLoggedIn = (req, res, next) => {

    //Fetch token from request header
    const headers = req.headers.authorization?.split(" ")[1];

    //Verify token
    jwt.verify(headers, process.env.SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: false, message: err?.message })
        }
        const useId = decoded?.user?.id;
        const user = await User.findById(useId).select("_id username email role");

        req.userAuth = user;
        next();
    })
}

export { isLoggedIn }