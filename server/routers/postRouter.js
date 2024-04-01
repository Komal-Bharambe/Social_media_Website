const router = require('express').Router();
const postsController = require('../controllers/postsController')
const requiredUser = require('../middlewares/requireUser')

router.get('/all',requiredUser, postsController.getAllPostsController);
router.post("/",requiredUser, postsController.createPostController);
router.post("/like",requiredUser, postsController.likeandUnlikePost);
router.put('/', requiredUser, postsController.updatePostController);
router.delete('/', requiredUser, postsController.deletePost);


module.exports = router;