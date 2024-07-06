const {validemail, validfirstName ,validlastName,validpassword}=require("../utils/validator");
const User=require("../models/userModel2");
const bcrypt=require("bcrypt");

const jwt=require("jsonwebtoken");


const registerUser=async (req,res)=>{
    try {
        const {firstname,lastname,email,password,profile_img}=req.body;


        const isuserexits=await User.findOne({email});
        if(isuserexits){
            return res.status(400).json({message:"User Already Exits"});
        }

        if(!validfirstName(firstname)){
            return res.status(400).json({message:"Invalid First Name"})
        }
        if(!validlastName(lastname)){
            return res.status(400).json({message:"Invalid Last Name"})
        }
        if(!validemail(email)){
            return res.status(400).json({message:"Invalid Email"})
        }
        if(!validpassword(password)){
            return res.status(400).json({message:"Invalid Password"})
        }

        
        const hashedPassword= await bcrypt.hash(password,10)
        
        let user={firstname,lastname,email,password:hashedPassword,profile_img}
        if(profile_img.length===0){
            user={firstname,lastname,email,password:hashedPassword}
        }
        
        const createUser=await User.create(user);


        console.log(createUser);

        return res.status(201).json({
            message:"Successfully created",
            _id:createUser._id,
            firstname:createUser.firstname,
            lastname:createUser.lastname,
            profile:createUser.profile_img
        })
        
    } catch (e) {
        console.log(e);
        return res.status(500).send(e)
    }

}


const authUser=async(req,res)=>{
    try {

        const {email,password}=req.body;

        if(email.length===0){
            return res.status(401).json({message:"Please Provide an Email "})
        }

        if(password.length===0){
            return res.status(401).json({message:"Please Provide an Password "})

        }

        const isuserexits=await User.findOne({email});
        if(!isuserexits){
            return res.status(400).json({message:"!User Not Found"});
        }

        
        const passMatch= await bcrypt.compare(password,isuserexits.password)

        if(!passMatch){
            return res.status(401).send("!Please Use Correct Password or Email")
        }

        const payload={user:{_id:isuserexits._id}}
        const bareartoken=jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"30d",
        });
        res.cookie("t",bareartoken,{expire:new Date()+9999})
        
        return res.status(200).json(
            {
                message:"Successfully Login",
                _id:isuserexits._id,
                firstname:isuserexits.firstname,
                lastname:isuserexits.lastname,
                profile:isuserexits.profile_img,
                accessToken:bareartoken
            }
            )
        
    }  catch (e) {
        console.log(e);
        return res.status(500).send(e)
    }
}

const get_all_user=async(req,res)=>{
    // try{
    //     const users=await User.find({_id:{$ne:req.user._id}}).select('-password');
    //     return res.status(201).json(users)
    // }catch(err){
    //     return res.status(401).send(err);
    // }
    const keyword = req.query.search
    ? {
        $or: [
          { firstname: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }).select('-password');
  res.send(users);
}

module.exports={registerUser,authUser,get_all_user};