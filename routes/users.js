const router = require('express').Router();
const bcrypt = require('bcrypt');

const User = require('../models/User');

//update user
router.put('/:id', async (req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(0);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }catch(err){
                return res.status(500).json(err);
            }
        }

        try{
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            });
            res.status(200).json({
                user, 
                "status": "update success"
            })
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        res.status(403).json("You can't update other account")
    }
})

//delete user
router.delete('/:id', async (req, res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("delete success")
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        res.status(403).json("You can't delete other account")
    }
})

//get a user
router.get('/:id', async (req, res)=>{
    try{
        const user = await User.findById(req.params.id);
        const {createdAt, updatedAt, isAdmin, password, ...other} = user._doc 
        res.status(200).json(other)
    }catch(err){

    }
})
//follow user
//unfollow user 

module.exports = router
