const mongoose = require("mongoose");

const bioSchema = new mongoose.Schema({
    User:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    Name:{
        type: String,
    
        default: " ",
    },
    Nickname:{
        type: String,
    
        default: " ",
    },
    Age:{
        type: Number,
    
        default: " ",
    },
    Sign:{
        type: String,
    
        default: " ",
    },
    favoriteFood:{
        type: String,
    
        default: " ",
    },
    favoriteMovie:{
        type: String,
    
        default: " ",
    },
    favoriteArtist:{
        type: String,
    
        default: " ",
    },
    favoriteSong:{
        type: String,
    
        default: " ",
    },
    Coolest:{
        type: String,
    
        default: " ",
    },

})

module.exports = mongoose.model("Bio", bioSchema);
