const express = require('express');
const router = express.Router();
const auth = require('../utils/auth');
const { getUser, followUser, unfollowUser, updatePic } = require('../controllers/userController');

router.get('/user/:id', auth, getUser);
router.put('/follow', auth, followUser);
router.put('/unfollow', auth, unfollowUser);
router.put('/updatePic', auth, updatePic);

module.exports = router;