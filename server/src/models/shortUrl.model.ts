import mongoose from "mongoose";
import { nanoid } from "nanoid";

const ShortUrlSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    fullUrl: {
        type: String,
        require: true
    },
    shortUrl: {
        type: String,
        require: true,
        default: () => nanoid().substring(0,10)
    },
    visibility: {
        type: String,
        enum: ["public", "private"],
        default: "public"
    },
    clicks: {
        type: Number,
        default: 0
    }
},{
    timestamps: true
})

export const urlModel = mongoose.model("ShortUrl", ShortUrlSchema);