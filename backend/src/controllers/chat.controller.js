import chatModel from "../models/chat.model.js";
import { generateResponse, generateTitle } from "../services/ai.service.js";
import messageModel from "../models/message.model.js";
import userModel from "../models/user.model.js";


// send a message to the AI and get a response from the AI. If chatId is not provided, create a new chat.
export async function sendMessage(req, res) {

    const { message, chat: chatId } = req.body;


    let title = null, chat = null;

    if (!chatId) {
        title = await generateTitle(message);
        chat = await chatModel.create({
            user: req.user.id,
            title
        })
    }

    const currentChatId = chatId || chat._id;

    const userMessage = await messageModel.create({
        chat: currentChatId,
        content: message,
        role: "user"
    })

    const messages = await messageModel.find({ chat: currentChatId })

    const result = await generateResponse(messages);

    const aiMessage = await messageModel.create({
        chat: currentChatId,
        content: result,
        role: "ai"
    })


    res.status(201).json({
        title,
        chatId: currentChatId,
        aiMessage
    })



}


// get all chats for a user
export async function getChats(req, res) {
      const user = req.user
      const chats  = await chatModel.findOne({user: user.id})
      
      res.status(200).json({
        message:"chats recieved succesfully",
        chats
      })

}


// retrieve messages for a chat
export async function  getMessages(req,res){
    const {chatId} = req.params;

    const chat  = await chatModel.findById({
        _id: chatId,
        user: req.user.id
    })

    if(!chat){
        return res.status(404).json({
            message:"Chat not found"
        })
    }

    const messages = await messageModel.find({chat: chatId})

    res.status(200).json({
        message:"Messages recieved succesfully",
        messages
    })
}


// delete a chat and its messages phones
export async function deleteChat(req,res){
 
    const {chatId} = req.params;

    const chat  = await chatModel.findOneAndDelete({
        _id: chatId,
        user: req.user.id
    })

    if(!chat){
        return res.status(404).json({
            message:"Chat not found"
        })
    }

    await messageModel.deleteMany({chat: chatId})

    res.status(200).json({
        message:"Chat deleted succesfully . ",
    })
}