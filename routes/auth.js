const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

//register
router.post('/register', async (req, res) => {
    try{
        //generate password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        //create user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashPassword
        });
        //save user
        const user = await newUser.save();
        res.status(200).json(user);
    }catch(err){
        console.log(err)
    }
})

//Login
router.post('/login', async (req, res) => {
    try{
        //find user
        const user = await User.findOne({
            username: req.body.username
        });
        //not found
        if(!user){
            res.status(404).send("user not found");
        }
        //valid
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword){
            res.status(400).json("wrong password");
        }
        //send back
        res.status(200).json(user);
    }catch(err){
        console.log(err)
    }
    
})

module.exports = router