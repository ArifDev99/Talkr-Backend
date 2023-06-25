const express=require("express");
const { authCheck } = require("../middlewares/authMiddleware");
const { accessChat, fetchChats, createGroupChat, renameChat, addToGroup, removeFromGroup } = require("../controllers/chatControllers");
const router=express.Router();




router.post("/",authCheck,accessChat);
router.get("/",authCheck,fetchChats);

router.post("/group",authCheck,createGroupChat);
router.put("/rename_group",authCheck,renameChat);
router.put("/addtogroup",authCheck,addToGroup);
router.put("/removefromgroup",authCheck,removeFromGroup);


module.exports=router;