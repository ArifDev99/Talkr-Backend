const express=require("express");
const router=express.Router();

const {authCheck}=require("../middlewares/authMiddleware");
const { allMessages, sendMessage } = require("../controllers/messageControllers");

router.get("/:chatId",authCheck,allMessages)  //This Route for get all messages for particular Chat
router.post("/",authCheck,sendMessage);

module.exports=router;