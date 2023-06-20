const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Profile = require("../models/userProfile")
const Comments = require("../models/Comments")

module.exports = {




createComment: async (req, res) => {
    try {
      
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