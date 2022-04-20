const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');

const createToken = (user) => {
    return jwt.sign({ user }, process.env.SECRET, {
        expiresIn: '7d',
    });
};

module.exports.register = async (req, res) => {
    const { name, email, password, pic } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(422).json({ errors: [{ msg: 'All fields are required.!' }] });
        }
        if (!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            return res.status(422).json({ errors: [{ msg: "Invalid email" }] });
        }
        if (password.length < 6) {
            return res.status(422).json({ errors: [{ msg: "password atleast 6 character long" }] });
        }
        const checkUser = await User.findOne({ email });
        if (checkUser) {
            return res.status(400).json({ errors: [{ msg: 'Email is already taken' }] });
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        try {
            const user = await User.create({
                name,
                email,
                password: hash,
                pic
            });
            const token = createToken(user);
            return res.status(200).json({ msg: 'Your account has been created', token });
        } catch (error) {
            return res.status(500).json({ errors: error });
        }
    } catch (error) {
        return res.status(500).json({ errors: error });
    }
};

module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(422).json({ errors: [{ msg: 'All fields are required.!' }] });
        }
        if (!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            return res.status(422).json({ errors: [{ msg: "Invalid email" }] });
        }
        if (password.length < 6) {
            return res.status(422).json({ errors: [{ msg: "password atleast 6 character long" }] });
        }
        const user = await User.findOne({ email });
        if (user) {
            const matched = await bcrypt.compare(password, user.password);
            if (matched) {
                const token = createToken(user);
                const { _id, name, email, followers, following, pic } = user;
                // console.log(_id, name, email);
                return res.status(200).json({ msg: 'You have login successfully', token, user: { _id, name, email, followers, following, pic } });
            } else {
                return res.status(401).json({ errors: [{ msg: 'Invalid Email or Password' }] });
            }
        } else {
            return res.status(404).json({ errors: [{ msg: 'Invalid Email or Password' }] });
        }
    } catch (error) {
        return res.status(500).json({ errors: error });
    }
};