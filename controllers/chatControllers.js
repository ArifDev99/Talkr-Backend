const Chat=require("../models/chatModel");
const User = require("../models/userModel2");

// for create or fetch one-one Chat


const accessChat= async (req,res)=>{
    const {userid}=req.body;
    
    if(!userid){
        return res.status(400).send("userId params not set with request")
    };

    let isChatExist=await Chat.find({
        isGroupChat:false,
        $and:[
            {users: {$elemMatch: {$eq:req.user._id}}},
            {users: {$elemMatch: {$eq:userid}}}
        ],
    }).populate("users","-password").populate("latestMessage")

    isChatExist=await User.populate(isChatExist,{
        path:"latestMessage.sender",
        select:"firstname profile_img email",
    });

    if (isChatExist.length > 0){
        res.send(isChatExist[0])
    }else{
        var chatData={
            chatName:"sender",
            isGroupChat:false,
            users:[req.user._id, userid],
        };
        try {
            const createdChat=await Chat.create(chatData);
            const FullChat=await Chat.findOne({_id:createdChat._id}).populate(
                "users",
                "-password"
            );
            res.status(200).json(FullChat);
            
        } catch (error) {
            res.status(500).send(error);
        }
    }
}

const fetchChats=async (req,res)=>{
    try {
        Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage")
        .sort({updatedAt:-1})
        .then(async (result)=>{
            result=await User.populate(result,{
                path:"latestMessage.sender",
                select:"firstname profile_img email",
            });
            res.status(200).send(result);
        })
    } catch (error) {
        res.status(400).send(error);
    }
}


const createGroupChat=async(req,res)=>{
    if(!req.body.name || !req.body.users){
       return  res.status(400).send("Please Fill Both Fileds")
    }
    let users=JSON.parse(req.body.users);
    if (users.length <2){
        return res.status(400).send("More than 2 user required to create a Group Chat")
    }
    users.push(req.user);

    try {
        const groupChat= await Chat.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user,
        });

        const fullGroupChat= await Chat.findOne({_id: groupChat._id})
        .populate("users","-password")
        .populate("groupAdmin","-password");
        return res.status(200).json(fullGroupChat)
    } catch (error) {
        return res.status(500).send(error);
    }
}


const renameChat=async(req,res)=>{
    const {chatId,chatName}=req.body;

    if(!chatId || !chatName){
        return res.status(400).send("Please Provide Chat id and New Chat Name")
    }

    try {
        const updateChat= await Chat.findByIdAndUpdate(
            chatId,
            {chatName:chatName},
            {new:true}
        )
        .populate("users","-password")
        .populate("groupAdmin","-password");
        if (!updateChat){
            return res.status(400).send("Chat Not Found")

        }
        return res.status(200).json(updateChat)
    } catch (error) {
        return res.status(500).send(error);
    }
}


const addToGroup=async(req,res)=>{
    const {chatId,userid}=req.body;

    if(!chatId || !userid){
        return res.status(400).send("Please Provide Chat id and User Id")
    }

    try {
        const updateChat= await Chat.findByIdAndUpdate(
            chatId,
            {$push:{users:userid}},
            {new:true}
        )
        .populate("users","-password")
        .populate("groupAdmin","-password");
        if (!updateChat){
            return res.status(400).send("Chat Not Found")

        }
        return res.status(200).json(updateChat)
    } catch (error) {
        return res.status(500).send(error);
    }
}
const removeFromGroup=async(req,res)=>{
    const {chatId,userid}=req.body;

    if(!chatId || !userid){
        return res.status(400).send("Please Provide Chat id and User Id")
    }

    try {
        const updateChat= await Chat.findByIdAndUpdate(
            chatId,
            {$pull:{users:userid}},
            {new:true}
        )
        .populate("users","-password")
        .populate("groupAdmin","-password");
        if (!updateChat){
            return res.status(400).send("Chat Not Found")

        }
        return res.status(200).json(updateChat)
    } catch (error) {
        return res.status(500).send(error);
    }
}

module.exports={accessChat ,fetchChats, createGroupChat,renameChat,addToGroup,removeFromGroup};