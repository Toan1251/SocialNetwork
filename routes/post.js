const router = require('express').Router();
const Post = require('../models/Post');

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
//like post
//get a post
//get timeline post

module.exports = router