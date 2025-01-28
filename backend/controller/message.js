import Messages from "../model/messages.js";
import express from "express"
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";

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



export default router