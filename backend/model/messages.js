import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema(
    {
        conversationId: {
            type: String,
        },
        text: {
            type: String,
        },
        sender: {
            type: String,
        },
        images: {
            public_id: {
                type: String,
            },
            url: {
                type: String,
            },
        },
        seen: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Messages = mongoose.model("Messages", messagesSchema)

export default Messages