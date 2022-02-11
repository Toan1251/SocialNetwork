const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

//create post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try{
        const savePost = await newPost.save();
        res.status(200).json(savePost)
    }catch(err){
        res.status(500).json(err);
    }
})

//update post
router.put("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.updateOne({
                $set: req.body
            });
            res.status(200).json("update success")
        }else{
            res.status(403).json("You don't have permission to update")
        }
    }catch(err){
        res.status(500).json(err)
    }
})

//delete post
router.delete("/:id", async (req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.deleteOne();
            res.status(200).json("delete success")
        }else{
            res.status(403).json("You don't have permission to delete")
        }
    }catch(err){
        res.status(500).json(err)
    }
})

//like & unlike post
router.put('/:id/like', async(req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            res.status(404).json("can't not find post")
        }
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({
                $push: {
                    likes: req.body.userId
                }
            })
            res.status(200).json("like")
        }else{
            await post.updateOne({
                $pull: {
                    likes: req.body.userId
                }
            })
            res.status(200).json("unlike")
        }
        
    }catch(err){
        res.status(500).json(err);
    }
})

//get a post
router.get("/:id", async(req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
        const {createdAt, updatedAt, __v, ...other} = post._doc
        res.status(200).json(other);
    }catch(err){
        res.status(500).json(err);
    }
})
//get timeline post
router.get('/:id/timeline', async(req, res)=>{
    try{
        const user = await User.findById(req.params.id);
        const userPosts = await Post.find({
            userId: req.params.id
        })
        const followPosts = await Promise.all(
            user.followings.map(id => {
                return Post.find({userId: id});
            })
        )
        res.status(200).json(userPosts.concat(followPosts))
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router