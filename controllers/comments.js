const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Profile = require("../models/userProfile")
const Comments = require("../models/Comments")

module.exports = {




createComment: async (req, res) => {
    try {
      const profile = await Profile.find({ user: req.user.id }).sort({ createdAt: "desc" }) //profiles of the user that is logged in (this for nav pic)
      //console.log(profile)
      //console.log(profile[0].profilePic)
      await Comments.create({
        comment: req.body.comment,
        madeBy: req.user.id,
        postId: req.params.id,
        likes:0,
        
      });
      
      console.log("Comment has been added!");
      res.redirect("/post/"+req.params.id);
    } catch (err) {
      console.log(err);
    }
  },
}