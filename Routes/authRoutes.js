// const express=require("express")
// const router=express.Router();

// const {validemail, validfirstName ,validlastName,validpassword}=require("../utils/validator");

// const bcrypt=require("bcrypt");

// const jwt=require("jsonwebtoken");

// const createDB=require("../config/db");

// const {Op}=require("sequelize");

// const User=require("../models/userModel");


// // Signup 


// router.post("/signup",async(req,res)=>{
//     try{
//         const {firstname,lastname,email,password}=req.body


//         const isuserexits=await User.findOne({where:{email}});
//         if(isuserexits){
//             return res.status(400).json({message:"User Already Exits"});
//         }

//         if(!validfirstName(firstname)){
//             return res.status(400).json({message:"Invalid First Name"})
//         }
//         if(!validlastName(lastname)){
//             return res.status(400).json({message:"Invalid Last Name"})
//         }
//         if(!validemail(email)){
//             return res.status(400).json({message:"Invalid Email"})
//         }
//         if(!validpassword(password)){
//             return res.status(400).json({message:"Invalid Password"})
//         }

        
//         const hashedPassword= await bcrypt.hash(password,10)

//         let user={firstname,lastname,email,password:hashedPassword}

//         const createUser=await User.create(user);


//         console.log(user);
//         return res.status(201).send("success")
//     }
//     catch(e){
//         console.log(e);
//         return res.status(500).send(e)
//     }
// })

// router.post("/signin",async(req,res)=>{
//     try {
//         const {email,password}=req.body;

//         if(email.length===0){
//             return res.status(401).json({message:"Please Provide an Email "})
//         }

//         if(password.length===0){
//             return res.status(401).json({message:"Please Provide an Password "})

//         }

//         const isuserexits=await User.findOne({where:{email}});
//         if(!isuserexits){
//             return res.status(400).json({message:"User not Exit"});
//         }

        
//         const passMatch= await bcrypt.compare(password,isuserexits.password)

//         if(!passMatch){
//             return res.status(401).send("!Please Use Correct Password or Email")
//         }

//         const payload={user:{id:isuserexits.id}}
//         const bareartoken=jwt.sign(payload,"SECRET MESSAGE",{
//             expiresIn:3600000,
//         })
//         res.cookie("t",bareartoken,{expire:new Date()+9999})
        
//         return res.status(200).json({message:"Successfully Login",firstname:isuserexits.firstname,accessToken:bareartoken})
//     } catch (e) {
//         console.log(e);
//         return res.status(500).send(e)
//     }
// })

// router.get("/get-all-user",async(req,res)=>{
//     try {
//         const alluser=await User.findAll({attributes: ['id','firstname', 'lastname']});
//         return res.status(200).json(alluser)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })



// module.exports=router