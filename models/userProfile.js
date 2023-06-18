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
        }
  
})

module.exports = mongoose.model("Profile", profileSchema);
