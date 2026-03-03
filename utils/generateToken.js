import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    const payload = {
        user: {
            id: user._id
        },
    };
    const expireInOneDay = 3600 * 24; // 24 hours in seconds
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: expireInOneDay });
    return token
}

export { generateToken }