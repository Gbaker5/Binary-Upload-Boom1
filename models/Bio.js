const mongoose = require("mongoose");

const bioSchema = new mongoose.Schema({
    User:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    Name:{
        type: String,
    
        
    },
    Nickname:{
        type: String,
    
       
    },
    Age:{
        type: Number,
    
       
    },
    Sign:{
        type: String,
    
        
    },
    favoriteFood:{
        type: String,
    
        
    },
    favoriteMovie:{
        type: String,
    
        
    },
    favoriteArtist:{
        type: String,
    
        
    },
    favoriteSong:{
        type: String,
    
        
    },
    Coolest:{
        type: String,
    
        
    },

})

module.exports = mongoose.model("Bio", bioSchema);
