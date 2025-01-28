import Conversation from "../model/conversation";
import express from "express"
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { isSeller, isAuthenticated } from "../middleware/auth.js";

const router = express.Router()

// create a new conversation
router.post("/create-new-conversation", catchAsyncErrors(async (req, res, next) => {
    try {
        const { groupTitle, userId, sellerId } = req.body;

        const isConversationExist = await Conversation.findOne({ groupTitle });

        if (isConversationExist) {
            const conversation = isConversationExist;
            res.status(201).json({
                success: true,
                conversation,
            });
        } else {
            const conversation = await Conversation.create({
                members: [userId, sellerId],
                groupTitle: groupTitle,
            });
    
            res.status(201).json({
                success: true,
                conversation,
            });
        }
    } catch (error) {
        return next(new ErrorHandler(error.response.message), 500);
    }
}))