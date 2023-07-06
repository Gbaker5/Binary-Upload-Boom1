const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Profile = require("../models/userProfile")
const Comments = require("../models/Comments")
const User = require("../models/User")

module.exports = {
  getSignupProfile: async (req, res) =>{
    res.render("signup-profile.ejs");
  },

  postSignupProfile: async (req, res) =>{
    try {
      
      const result = await cloudinary.uploader.upload(req.file.path); //send image to cloudinary
      
      await Profile.create({ //create Profile object and send to Mongo database
        user: req.user.id,
        profilePic: result.secure_url,
        cloudinaryId: result.public_id,      
      });
      console.log("Profile picture has been changed!");
      res.redirect("/profile"); //refresh profileEdit page
    } catch (err) {
      console.log(err);
    }
  },

  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id }); //find all posts in database by user
      const profile = await Profile.find({ user: req.user.id }).sort({ createdAt: "desc" }); //The profile.find finds all profile pics from that user and displays in an array. the sort fuction sorts them in descending order (in the ejs i choose the first object on the list)
      res.render("profile.ejs", { posts: posts, profile: profile, user: req.user }); //renders profile page with post array, profile array, and user in ejs page

      
    } catch (err) {
      console.log(err);
    }
  },
  //profile Edit
  getProfileEdit: async (req, res) => {
    try {
      const count = await Profile.countDocuments({user: req.user.id}) //counts all profile documents
      const profile = await Profile.find({ user: req.user.id }).sort({ createdAt: "desc" });//The profile.find finds all profile pics from that user and displays in an array. the sort fuction sorts them in descending order (in the ejs i choose the first object on the list)
      res.render("profileEdit.ejs", { profile: profile, user: req.user }); //renders profile array and user
      
      console.log(profile)
      console.log(count)
    } catch (err) {
      console.log(err);
    }
  },

  postProfileEdit: async (req, res) =>{
    try {
      
      const result = await cloudinary.uploader.upload(req.file.path); //send image to cloudinary
      
      await Profile.create({ //create Profile object and send to Mongo database
        user: req.user.id,
        profilePic: result.secure_url,
        cloudinaryId: result.public_id,      
      });
      console.log("Profile picture has been changed!");
      res.redirect("/profileEdit"); //refresh profileEdit page
    } catch (err) {
      console.log(err);
    }
  },

  //Feed
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean(); //find all posts and sort in descending order putting most recent at the top
      res.render("feed.ejs", { posts: posts }); //renders posts
    } catch (err) {
      console.log(err);
    }
  },
  //Posts
  getPost: async (req, res) => {
    try { //if comment[i].madeBy = profile[i].user){profile[i].}
      //const allProfile = await Profile.find()
      const allUsers = await User.find()
      const allProfile = await Profile.find()
      const profile = await Profile.find({ user: req.user.id }).sort({ createdAt: "desc" }) //profiles of the user that is logged in (this for nav pic)
      const post = await Post.findById(req.params.id); //find post in db with specific id (in ejs id is all the href/link to specific post page)
      const comments = await Comments.find({postId: req.params.id}).sort({ createdAt: "desc" }).lean() //find all comments in comment collection that have postID that matches the id in POST variable 
      console.log(comments)
      //
      //for(let i=0;i<comments.length;i++){
        //console.log("comment user" + "-" + comments[i].madeBy)

        //for(let j=0;j<allUsers.length;j++){
          //console.log("users" + "-" + allUsers[j]._id)
          
          //if(comments[i].madeBy == allUsers[j]._id){
            //console.log("This is the user" + allUsers[j]._id)
          //}
        //}
      //}
      
      
      
      
      //console.log(comments)
      res.render("post.ejs", { post: post, user: req.user, profile: profile, comments: comments, allProfile: allProfile, allUsers: allUsers});
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => { 
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
  //comments
  

  
  deleteComment: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
