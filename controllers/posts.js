const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Profile = require("../models/userProfile")

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id }); //find all posts in database by user
      const profile = await Profile.find({ user: req.user.id }).sort({ createdAt: "desc" }); //The profile.find finds all profile pics from that user and displays in an array. the sort fuction sorts them in descending order (in the ejs i choose the first object on the list)
      res.render("profile.ejs", { posts: posts, profile: profile, user: req.user }); //renders profile page with post array, profile array, and user in ejs page
      
    } catch (err) {
      console.log(err);
    }
  },
  
  getProfileEdit: async (req, res) => {
    try {
      
      const profile = await Profile.find({ user: req.user.id }).sort({ createdAt: "desc" });//The profile.find finds all profile pics from that user and displays in an array. the sort fuction sorts them in descending order (in the ejs i choose the first object on the list)
      res.render("profileEdit.ejs", { profile: profile, user: req.user }); //renders profile array and user
      console.log(profile)
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


  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean(); //find all posts and sort in descending order putting most recent at the top
      res.render("feed.ejs", { posts: posts }); //renders posts
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id); //find post in db with specific id (in ejs id is all the href/link to specific post page)
      res.render("post.ejs", { post: post, user: req.user });
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
};
