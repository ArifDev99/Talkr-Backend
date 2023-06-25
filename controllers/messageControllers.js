const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel2");

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content) {
    console.log("Invalid Data content Into request ");
    return res.status(400).send("Invalid Data Passed Into request");
  }
  if (!chatId) {
    console.log("Invalid Data chat id Into request");
    return res.status(400).send("Invalid Data Passed Into request");
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "firstname profile_img");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "firstname profile_img email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const allMessages = async (req, res) => {
  
//   if (!chatId) {
//     console.log("Invalid Chat Id");
//     return res.status(400).send("Invalid Chat Id");
//   }
  try {
    const message = await Message.find({ chat:req.params.chatId })
      .populate("sender", "firstname profile_img email")
      .populate({
        path: "chat",
        populate: {
          path: "users",
          select: "firstname profile_img email",
        },
      });

    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = { sendMessage, allMessages };
