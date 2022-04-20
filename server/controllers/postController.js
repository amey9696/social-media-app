const Post = require('../models/post');

module.exports.createPost = async (req, res) => {
    const { title, body, photo } = req.body;
    if (!title || !body || !photo) {
        return res.status(404).json({ errors: [{ msg: 'All fields are required' }] });
    }
    req.user.password = undefined; //password not store in post mongo schema 
    req.user.createdAt = undefined;
    req.user.updatedAt = undefined;
    req.user.__v = undefined;
    try {
        const response = await Post.create({
            title,
            body,
            photo,
            postedBy: req.user
        });
        return res.status(200).json({ msg: 'Your post has been created successfully', response });
    } catch (error) {
        return res.status(500).json({ errors: error, msg: error.message });
    }
}

module.exports.fetchPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("postedBy", "_id name pic").populate("comments.postedBy", "_id name pic").sort({ updatedAt: -1 });
        return res.status(200).json({ posts });
    } catch (error) {
        return res.status(500).json({ errors: error, msg: error.message });
    }
}

module.exports.fetchPost = async (req, res) => {
    try {
        const post = await Post.find({ postedBy: req.user._id }).populate("postedBy", "_id name pic").sort({ updatedAt: -1 });
        return res.status(200).json({ post });
    } catch (error) {
        return res.status(500).json({ errors: error, msg: error.message });
    }
}

module.exports.getSubscriberPost = async (req, res) => {
    try {
        const post = await Post.find({ postedBy: { $in: req.user.following } }).populate("postedBy", "_id name pic");
        return res.status(200).json({ post });
    } catch (error) {
        return res.status(500).json({ errors: error, msg: error.message });
    }
}

module.exports.deletePost = async (req, res) => {
    const id = req.params.postId;
    // console.log(id)
    try {
        6
        const response = await Post.findByIdAndRemove(id).populate("comments.postedBy", "_id name pic");
        return res.status(200).json({ msg: 'Your post has been deleted', response });
    } catch (error) {
        return res.status(500).json({ errors: error, msg: error.message });
    }
};

module.exports.deleteComment = async (req, res) => {
    Post.findById(req.params.postId).populate("comments.postedBy", "_id name pic").exec((err, post) => {
        if (err || !post) {
            return res.status(422).json({ message: "Some error occured!!" });
        }
        const comment = post.comments.find((comment) =>
            comment._id.toString() === req.params.commentId.toString()
        );
        if (comment.postedBy._id.toString() === req.user._id.toString()) {
            const removeIndex = post.comments.map(comment => comment.postedBy._id.toString()).indexOf(req.user._id);
            post.comments.splice(removeIndex, 1);
            post.save()
                .then(result => {
                    res.json(result)
                }).catch(err => console.log(err));
        }
    })
}

module.exports.likePost = (req, res) => {
    try {
        Post.findByIdAndUpdate(req.body.postId, {
            $push: { likes: req.user._id } //login user can like post
        }, {
            new: true //mongo return new record
        }).exec((err, result) => {
            if (err) {
                return res.status(422).json({ errors: err, msg: error.message });
            } else {
                return res.status(200).json(result);
            }
        })
    } catch (error) {
        return res.status(500).json({ errors: error, msg: error.message });
    }
}

module.exports.unlikePost = (req, res) => {
    try {
        Post.findByIdAndUpdate(req.body.postId, {
            $pull: { likes: req.user._id } //login user can unlike post
        }, {
            new: true //mongo return new record
        }).exec((err, result) => {
            if (err) {
                return res.status(422).json({ errors: err, msg: error.message });
            } else {
                return res.status(200).json(result);
            }
        })
    } catch (error) {
        return res.status(500).json({ errors: error, msg: error.message });
    }
}

module.exports.commentPost = (req, res) => {
    const comment = {
        text: req.body.text, //send from front end
        postedBy: req.user._id
    }
    try {
        Post.findByIdAndUpdate(req.body.postId, {
            $push: { comments: comment } //login user can comment on post
        }, {
            new: true //mongo return new record
        }).populate("comments.postedBy", "_id name pic")
            .populate("postedBy", "_id name pic")
            .exec((err, result) => {
                if (err) {
                    return res.status(422).json({ errors: err, msg: error.message });
                } else {
                    return res.status(200).json(result);
                }
            })
    } catch (error) {
        return res.status(500).json({ errors: error, msg: error.message });
    }
}


module.exports.updatePhoto = (req, res) => {
    try {
        const user = Post.findByIdAndUpdate(req.body.postId, { $set: { photo: req.body.photo } }, { new: true })
            .populate("postedBy", "_id name").
            exec((err, result) => {
                if (err) {
                    return res.status(422).json({ errors: err });
                }
                return res.status(200).json(result);
            });
    } catch (error) {
        return res.status(500).json({ errors: "photo cannot be updated" });
    }
}
