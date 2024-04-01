const Post = require("../models/Post");
const User = require("../models/User");
const { success, error } = require("../utils/responseWrapper");
const { mapPostOutput } = require("../utils/Utils");
const cloudinary = require('cloudinary').v2;
 
const followOrUnfollowUserController = async(req,res) =>{
    try{
    const {userIdToFollow} = req.body;
    const curUserId = req._id;

    const userToFollow = await User.findById(userIdToFollow);

    const curUser = await User.findById(curUserId);

    //yourself is not folloewd
    if(curUserId === userIdToFollow){
        return res.send(error(409, 'user cannot follow themself'));
    }
    if(!userToFollow){
        return res.send(error(404, 'User to follow not found'));
    }

    if(curUser.followings.includes(userIdToFollow)){ //alredy followed
        const followingIndex = curUser.followings.indexOf(userIdToFollow);
        curUser.followings.splice(followingIndex,1);

        const followerIndex = userToFollow.followers.indexOf(curUser);
        userToFollow.followers.splice(followerIndex,1);

       await  curUser.save();
       await userToFollow.save();

       return res.send(success (200, 'User unfollowed'))
    }
    else{
        userToFollow.followers.push(curUserId);
        curUser.followings.push(userIdToFollow);

    }
        await  userToFollow.save();
        await curUser.save();
 
        return res.send(success (200, {user: userToFollow}))
    }
    catch(e){
        console.log(e);
        return res.send(error(500, e.message));
    }
};

const getPostofFollowing = async(req,res) =>{
    try{
    const curUserId = req._id;

    const curUser = await User.findById(curUserId).populate("followings");

    const fullPosts = await Post.find({
        owner:{
            '$in': curUser.followings
        }
    }).populate('owner');

    const posts = fullPosts.map(item => mapPostOutput(item, req._id)).reverse();

    console.log('posthere', posts);

    curUser.posts = posts;

    const followingsIds = curUser.followings.map(item => item._id);

    followingsIds.push(req._id);
    const suggestions = await User.find({
        _id:{
                $nin: followingsIds,
        }
    })

    return res.send(success(200, {...curUser._doc, suggestions, posts}))
}
    catch(e){
        console.log(e);
        return res.send(error(500, e.message));
    }
}

const getMyPosts = async(req, res) =>{
    try{
        const curUserId = req._id;
        const allUserPosts = await Post.find({
            owner: curUserId
        }).populate('likes');

        return res.send(success(200, {allUserPosts}))
    }
    catch(error){
        console.log(e);
        return res.send(error(500, e.message));
    }
}

const getUserPosts = async(req,res) =>{
    try{
        const UserId = req.body.UserId;
        if(!UserId){
            return res.send(error(400, 'UserId is required'))
        }
        const allUserPosts = await Post.find({
            owner: UserId
        }).populate('likes');

        return res.send(success(200, {allUserPosts}))
    }
    catch(error){
        console.log(e);
        return res.send(error(500, e.message));
    }
}

const deleteMyProfile = async (req,res) =>{
    try{
    const curUserId = req._id;
    const curUser = await User.findById(curUserId);

    // delete all posts
    await Post.deleteMany({
        owner: curUserId 
    })

    // remove my self form followers following 
    curUser.followers.forEach(async(followerId) => { 
        const follower = await User.findById(followerId);
        const index = follower.following.indexOf(curUserId);
        follower.following.splice(index, 1);
        await follower.save();
    })

    //remove myself from my following follwers
    curUser.followings.forEach(async(followerId) => { 
        const following = await User.findById(followerId);
        const index = following.followers.indexOf(curUserId);
        following.followers.splice(index, 1);
        await following.save();
    })

    //remove myself from all likes

    const allPosts = await Post.find();
    allPosts.forEach(async(post) =>{
        const index = post.likes.indexOf(curUserId);
        post.likes.splice(index,1);
        await post.save();
    })

    //delete user
    await curUser.remove();

    res.clearCookie('jwt', {
        httpOnly: true,
        secure: true,
    })

    return res.send(success(200, 'user deleted'));
    }
    catch(e) {
        console.log(e);
        return res.send(error(500, e.message))
    }

    
};
const getMyInfo = async(req,res) =>{
    try{

        const user = await User.findById(req._id);
        return res.send(success(200, {user}))
    }
    catch(e){
        console.log(e);
        return res.send(error(500, e.message));
    }
    
}

const updataUserProfile = async (req,res) =>{
    try {
        const {name,bio, userImg} = req.body;

        const user = await User.findById(req._id)

        if(name){
            user.name = name;
        }
        if(bio){
            user.bio = bio;
        }
        if(userImg){
            const cloudImg = await cloudinary.uploader.upload(userImg, {
                folder:'profileImg'
            })
            user.avatar ={
                url: cloudImg.secure_url,
                publicId: cloudImg.public_id
            }
        }
        await user.save();
        return res.send(success(200,{user}))
    } catch (error) {
        
    }
}
const getUserProfile = async(req,res) =>{
    try {
        const userId = req.body.userId;
        const user = await User.findById(userId).populate({
            path:'posts',
            populate:{
                path: 'owner'
            }
        });
        const fullPosts = user.posts;
        const posts = fullPosts.map(item => mapPostOutput(item, req._id)).reverse();

        return res.send(success(200, {...user._doc, posts}))

    } catch (e) {
        return res.send(error(500, e.message))
    }
}
module.exports = {
    followOrUnfollowUserController,
    getPostofFollowing,
    getMyPosts,
    getUserPosts,
    deleteMyProfile,
    getMyInfo,
    updataUserProfile,
    getUserProfile,
    
}