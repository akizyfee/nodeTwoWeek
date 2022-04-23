const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        name: { 
            type: String,
            required: true
        },
        image: {
            type: String,
            default: '',
        },
        content: {
            type: String,
            required: [true, 'Content 未填寫'],
        },
        createdAt: {
            type: Date,
            default: Date.now,
            // select: false  不傳到前端
        },
        likes: {
            type: Number,
            default: 0,
        }
    },
    {
        versionKey: false,
        // timestamps: true 是否新增上傳和更新時間
    }
)

const Post = mongoose.model("Post", roomSchema);

module.exports = Post;
