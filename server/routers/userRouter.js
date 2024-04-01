const requireUser = require('../middlewares/requireUser');
const UserController = require("../controllers/userController")


const router = require('express').Router();

router.post('/follow', requireUser, UserController.followOrUnfollowUserController)
router.get('/getFeedData', requireUser, UserController.getPostofFollowing)
router.get('/getMyPosts', requireUser, UserController.getMyPosts);
router.get('/getUserPosts', requireUser, UserController.getUserPosts);
router.get('/', requireUser, UserController.deleteMyProfile)
router.get('/getMyInfo', requireUser, UserController.getMyInfo);
router.put('/', requireUser, UserController.updataUserProfile)

router.post('/getUserProfile', requireUser, UserController.getUserProfile)
module.exports = router;