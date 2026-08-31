import mongoose from "mongoose";

const groupChatSchema = new mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group"
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        required: true
    }
}, {timestamps: true});

const GroupChat = mongoose.model("GroupChat", groupChatSchema);

export default GroupChat;