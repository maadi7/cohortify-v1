const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt")

//get all users
router.get("/all", async(req, res)=>{
    try {
        const data = await User.find();
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
    }
})
// update user
router.put("/:id", async (req, res)=>{
      if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt)

            } catch (error) {
                console.log(error);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            });
            res.status(200).json("Account has been Updated");
        } catch (error) {
            console.log(error);
            return res.status(500).json(err);
        }        
      }else{
        return res.status(403).json("you can only update your account");
      }
})

// delete user
router.delete("/delete/:id", async (req, res) =>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try {
             await User.findByIdAndDelete(req.params.id);
            res.status(200).send("User has been deleted")
        } catch (error) {
            res.status(500).json(err);

        }
    }else{
        res.status(403).send("you can only delete your account");
    }
});

// get a user
router.get("/", async (req, res) =>{
    const userId = req.query.userId;
    const username = req.query.username;
        try {
            const user = userId ? await User.findById(userId) :
            await User.findOne({username : username}) ;
    
            res.status(200).json(user);
        }catch(error)
        {
            res.status(500).json(error);
        }
        
    
})
//get friends
// router.get("/friends/:userId", async (req, res)=>{
//     try {
//         const user = await User.findById(req.params.userId);
//         const friends = await Promise.all(
//             user.followings.map(friendId =>{
//                 return User.findById(friendId);
//             })
//         )
//         let friendList = [];
//         friends.map((friend) =>{
//             const {_id, username, ProfilePicture } = friend;
//             friendList.push({_id, username, ProfilePicture});

//         });
//         res.status(200).json(friendList);
//     } catch (error) {
//         res.status(500).json(error)
//     }
// })

module.exports = router