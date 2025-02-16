import Messages from "../model/messages.js";
import express from "express"
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import upload from "../multer.js";
import Conversation from "../model/conversation.js"

const router = express.Router()

// create new message
router.post("/create-new-message", upload.array("images"), catchAsyncErrors(async (req, res, next) => {
    try {
        const messageData = req.body;

        if (req.files) {
            const files = req.files
            const imageUrls = files.map((file) => `${file.filename}`)

            messageData.images = imageUrls
        }

        messageData.conversationId = req.body.conversationId;
        messageData.sender = req.body.sender;
        messageData.text = req.body.text;

        const message = new Messages({
            conversationId: messageData.conversationId,
            text: messageData.text,
            sender: messageData.sender,
            images: messageData.images ? messageData.images : undefined,
        });

        await message.save();

        res.status(201).json({
            success: true,
            message,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message), 500);
    }
}));

// get all messages with conversation id
router.get( "/get-all-messages/:id", catchAsyncErrors(async (req, res, next) => {
    try {
        const messages = await Messages.find({
            conversationId: req.params.id,
        });

        res.status(201).json({
            success: true,
            messages,
        });
    } catch (error) {
    return next(new ErrorHandler(error.message), 500);
    }
}));

// mark messages as seen
router.put("/mark-messages-as-seen/:conversationId", catchAsyncErrors(async (req, res, next) => {
    try {
        const { conversationId } = req.params;
        const { userId } = req.body;

        await Messages.updateMany(
            { conversationId, sender: { $ne: userId }, seen: false },
            { $set: { seen: true } }
        );

        res.status(200).json({
            success: true,
            message: "Messages marked as seen",
        });
    } catch (error) {
        return next(new ErrorHandler(error.message), 500);
    }
}));

// Get total unread messages for a user
router.get("/get-total-unread-messages/:userId", catchAsyncErrors(async (req, res, next) => {
    try {
        const { userId } = req.params;

        // Fetch all conversations for the user
        const conversations = await Conversation.find({ members: { $in: [userId] } });

        let totalUnread = 0;

        // Loop through each conversation and count unread messages
        for (const conversation of conversations) {
            const unreadMessages = await Messages.find({
                conversationId: conversation._id,
                seen: false,
                sender: { $ne: userId },
            });

            totalUnread += unreadMessages.length;
        }

        res.status(200).json({
            success: true,
            totalUnread,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

export default router 