const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
         },
    profilePic: {
        type: String,
        require: true,
        },
    cloudinaryId: {
        type: String,
        require: true,
        },
    createdAt: {
    type: Date,
    default: Date.now,
  },    

  
})

module.exports = mongoose.model("Profile", profileSchema);
