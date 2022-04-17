const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        name: { 
            type: String,
            required: true
        },
        price:{
            type: Number,
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            // select: false  不傳到前端
        }
    },
    {
        versionKey: false,
        // timestamps: truw 是否新增上傳和更新時間
    }
)

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
