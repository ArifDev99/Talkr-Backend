const mongoose=require('mongoose');

const userModel=mongoose.Schema({
    firstname:{type:String,required:true},
    lastname:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    profile_img:{
        type:String,
        required:false,
        default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
},{
    timestamps:true
});


const User=mongoose.model("User",userModel);
module.exports=User;