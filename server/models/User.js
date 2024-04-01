const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase:true
    },
    password:{
        type: String,
        required: true,
        select: false 
    },
    name:{
        type: String,
        required: true
    },
    bio:{
        type:String 
    },
    avatar:{ // profile img
        publicId: String,
        url: String 
    },
    followers:[ //Array of objectId
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    followings:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    posts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'post'
        }
    ]
}, {
    timeStamps: true
})

module.exports = mongoose.model("user", userSchema);