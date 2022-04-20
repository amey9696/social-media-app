const Post = require('../models/post');
const User = require('../models/user');

module.exports.getUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).select("-password");
        if (user) {
            const post = await Post.find({ postedBy: req.params.id }).populate("postedBy", "_id name")
                .exec((err, posts) => {
                    if (err) {
                        return res.status(422).json({ errors: err });
                    }
                    return res.status(200).json({ user, posts });
                })
        } else {
            return res.status(404).json({ errors: "User not found" });
        }
    } catch (error) {
        return res.status(500).json({ errors: error });
    }
}

module.exports.followUser = (req, res) => {
    try {
        const user = User.findByIdAndUpdate(req.body.followId, { //this is id of followed person & your logged user
            $push: { followers: req.user._id } //logged user id
        }, {
            new: true
        }, (err, result) => {
            if (err) {
                return res.status(422).json({ errors: err });
            }
            User.findByIdAndUpdate(req.user._id, {
                $push: { following: req.body.followId }
            }, {
                new: true
            }).select("-password").then(result => {
                res.json(result);
            }).catch(err => {
                return res.status(422).json({ errors: err });
            })
        }
        );
    } catch (error) {
        return res.status(500).json({ errors: error });
    }
}

module.exports.unfollowUser = (req, res) => {
    try {
        const user = User.findByIdAndUpdate(req.body.unfollowId, { //this is id of unfollowed person & your logged user
            $pull: { followers: req.user._id } //logged user id
        }, {
            new: true
        }, (err, result) => {
            if (err) {
                return res.status(422).json({ errors: err });
            }
            User.findByIdAndUpdate(req.user._id, {
                $pull: { following: req.body.unfollowId }
            }, {
                new: true
            }).select("-password").then(result => {
                res.json(result);
            }).catch(err => {
                return res.status(422).json({ errors: err });
            })
        }
        );
    } catch (error) {
        return res.status(500).json({ errors: error });
    }
}

module.exports.updatePic = (req, res) => {
    try {
        const user = User.findByIdAndUpdate(req.user._id, { $set: { pic: req.body.pic } }, { new: true },
            (err, result) => {
                if (err) {
                    return res.status(422).json({ errors: err });
                }
                return res.status(200).json(result);
            });
    } catch (error) {
        return res.status(500).json({ errors: "pic cannot be updated" });
    }
}