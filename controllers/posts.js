const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Profile = require("../models/userProfile")
const Comments = require("../models/Comments")
const User = require("../models/User")
const Bio = require("../models/Bio")
const Friends = require("../models/Friend")

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
      const bio = await Bio.findOne({User: req.user.id})
      
      res.render("profile.ejs", { posts: posts, profile: profile, user: req.user, bio: bio}); //renders profile page with post array, profile array, and user in ejs page

      
    } catch (err) {
      console.log(err);
    }
  },
  //profile Edit
  getProfileEdit: async (req, res) => {
    try {
      
      const count = await Profile.countDocuments({user: req.user.id}) //counts all profile documents
      const profile = await Profile.find({ user: req.user.id }).sort({ createdAt: "desc" });//The profile.find finds all profile pics from that user and displays in an array. the sort fuction sorts them in descending order (in the ejs i choose the first object on the list)
      const obj = await Profile.find({id: req.param.id}).sort({_id: "desc"})
      res.render("profileEdit.ejs", { profile: profile, user: req.user }); //renders profile array and user
      
      
      //console.log(profile)
      console.log(count)
      //console.log(obj)
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

  putProfileEdit: async (req,res) =>{
    try{
      console.log(req.body)
      console.log("yes")

      await Profile.findOneAndUpdate(
        { profilePic: req.body.profile},
        {
          $set: {createdAt: Date.now()},
        }
      )
      console.log("Profile picture has been UPDATED!");
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
      //const allUsers = await User.find()
      //const allProfile = await Profile.find()
      const profile = await Profile.find({ user: req.user.id }).sort({ createdAt: "desc" }) //profiles of the user that is logged in (this for nav pic)
      const post = await Post.findById(req.params.id); //find post in db with specific id (in ejs id is all the href/link to specific post page)

      let commentPosterIdArr = [];
      let commentPosterProfilePicArr = [];

      const comments = await Comments.find({postId: req.params.id}).sort({ createdAt: "desc" }).lean() //find all comments in comment collection that have postID that matches the id in POST variable 
      //console.log(comments)

      //comment profile pic
      for(let i=0;i<comments.length;i++){
        const commentPoster = await Profile.find({user: comments[i].madeBy}).sort({createdAt: "desc"}); //find the profile by the user. User is comments.madeBy which is the profile.user of the person who commented. find all the profiles of the USER for each comment. Loop through comments to find prifile users. Sort in descending order to get most recent profile
      
        
        const image = commentPoster[0].profilePic; //the commentPoster[0] grabs the most recent profile of each commenter and then grabs the image from that profile
        commentPosterProfilePicArr.push(image); //push images into array in order of comments   
        const commentId = commentPoster[0].user;
        commentPosterIdArr.push(commentId)
      }
      console.log("Array")
      console.log(commentPosterIdArr)


      res.render("post.ejs", { 
        post: post, 
        user: req.user, 
        profile: profile, 
        comments: comments, 
        posterImage: commentPosterProfilePicArr,
        posterId: commentPosterIdArr
      });
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


//Guest
getGuest: async (req,res) =>{
  try{
    const profile = await Profile.find({ user: req.user.id }).sort({ createdAt: "desc" }); //The profile.find finds all profile pics from that user and displays in an array. the sort fuction sorts them in descending order (in the ejs i choose the first object on the list)
    const guestProfile = await Profile.find({user: req.params.id}).sort({ createdAt: "desc"})
    const bio = Bio.find({User: req.params.id})
    console.log(req.params)
    res.render("guest.ejs", {profile:profile, guestProfile: guestProfile, bio:bio})
  } catch (err){
    console.log("This is the guest Profile of ")
}
},

//Friends

getFriends: async (req, res) =>{
  try{
    const profile = await Profile.find({ user: req.user.id }).sort({ createdAt: "desc" });
    const friends = await Friends.find({user: req.user.id}).sort({createdAt: "desc"})
    res.render("friends.ejs", {profile: profile, friends: friends})
    console.log("This is your friends list")
  } catch (err){
    console.log(err)
  }
},

putFriend: async (req,res) => {
  try{
      Friends.findOneAndUpdate(
        {friend: req.body.profileblah},
        { $set: {
          user: req.user.id,
          friend: req.body.profileblah,
          createdAt: Date.now()
        }},
        {upsert:true}
      )


    res.redirect("/friends")
    console.log("Added Friend")
  } catch (err){
    console.log()
  }

},
//Bio
putBio: async (req, res) =>{
 
  try{
    
    console.log(req.user.id)
    await Bio.findOneAndUpdate(

      {User: req.user.id}, 
      { $set: {
      User: req.user.id,
      Name: req.body.name,
      Nickname: req.body.nickname,
      Age: req.body.age,
      Sign: req.body.sign,
      favoriteMovie: req.body.favoriteMovie,
      favoriteFood: req.body.favoriteFood,
      favoriteArtist: req.body.favoriteArtist,
      favoriteSong: req.body.favoriteSong,
      Coolest: req.body.cool,
      }
      },
      {upsert:true});
    console.log("Updated Bio!!!");
    res.redirect("/profile");

} catch (err){
  console.log(err)
}
},

};