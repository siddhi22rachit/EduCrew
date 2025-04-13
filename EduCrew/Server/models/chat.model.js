import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    senderId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    recieverId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type: String,
        required: true
    },
    image:{
        type: String,
    }
});