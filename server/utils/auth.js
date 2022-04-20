const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');

module.exports = (req, res, next) => {
    const authHeaders = req.headers.authorization;
    const token = authHeaders;
    if (!token) {
        return res.status(401).json({ error: "you must be logged in" });
    }
    // console.log(token);
    try {
        jwt.verify(token, process.env.SECRET, async (err, payload) => {
            if (err) {
                return res.status(401).json({ error: "you must be logged in" });
            }
            else {
                try {
                    const { user: { _id } } = payload;
                    const userData = await User.findById(_id);
                    req.user = userData;
                    next();
                } catch (error) {
                    return res.status(401).json({ errors: [{ msg: error.message }] });
                }
            }
        });
    } catch (error) {
        return res.status(401).json({ errors: [{ msg: error.message }] });
    }
}