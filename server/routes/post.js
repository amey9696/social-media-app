const express = require('express');
const router = express.Router();
const auth = require('../utils/auth');
const { createPost, fetchPosts, getSubscriberPost, fetchPost, likePost, unlikePost, commentPost, deletePost, deleteComment, updatePhoto } = require('../controllers/postController')

router.post('/createPost', auth, createPost);
router.get('/allPosts', auth, fetchPosts);
router.get('/getSubscriberPost', auth, getSubscriberPost);
router.get('/myPost', auth, fetchPost);
router.put('/like', auth, likePost);
router.put('/unlike', auth, unlikePost);
router.put('/updatePhoto', auth, updatePhoto);
router.put('/comment', auth, commentPost);
router.delete('/deletePost/:postId', auth, deletePost);
router.delete('/deleteComment/:postId/:commentId', auth, deleteComment);

module.exports = router;