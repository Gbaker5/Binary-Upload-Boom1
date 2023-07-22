const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema({
    user: { //This is the person clicking the add friend button
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
         },
    friend: { //This is the person being added
        type: String,
        require: true,
        },
    createdAt: {
    type: Date,
    default: Date.now,
  },    

  
})

module.exports = mongoose.model("Friend", friendSchema);
