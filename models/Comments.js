const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
    comment: {
        type: String,
        require: true,
    },
    madeBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
         },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        },
    likes: {
        type: Number,
        required: true,
          },
    createdAt: {
    type: Date,
    default: Date.now,
  },    

  
})

module.exports = mongoose.model("Comments", commentsSchema);
