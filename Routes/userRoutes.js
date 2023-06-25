const express=require("express");
const { registerUser,authUser, get_all_user } = require("../controllers/userControllers");
const { authCheck } = require("../middlewares/authMiddleware");
const router=express.Router();


router.post('/signup',registerUser);
router.post('/login',authUser);
router.get('/',authCheck,get_all_user);




module.exports = router;