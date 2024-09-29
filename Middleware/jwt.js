const { sign, verify } = require("jsonwebtoken");
const User = require("../Models/user");

const createToken = (user) => {
    const accessToken = sign({ email: user.email, id: user._id }, "hellothere");
    return accessToken;
};

const validateToken = async (req, res, next) => {
    const accessToken = req.cookies["access-token"];

    if (!accessToken) {
        return res.status(400).send({ err: "User not authenticated" });
    }

    try {
        const validToken = verify(accessToken, "hellothere");

        if (validToken) {
            const userId = validToken.id;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            req.user = user;
            req.authenticated = true;
            return next();
        }
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = { createToken, validateToken };
