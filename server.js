const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Post = require("./models/posts");
const headers = require("./utils/headers");
const errorHandle = require("./utils/errorHandle");
const successHandle = require("./utils/successHandle");

dotenv.config({path: './config.env'});
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB).then(() => {
  console.log('連線資料庫成功');
})


const requestListener = async (req,res)=>{
    let body = "";
    req.on("data",chunk=>{
        body+=chunk;
    })
    if(req.url=="/posts" && req.method=="GET"){
        const posts = await Post.find();
        res.writeHead(200,headers);
        res.write(JSON.stringify({
            "status":"success",
            posts
        }))
        res.end()
    }else if(req.url=="/posts" && req.method=="POST"){
        req.on("end",async()=>{
            try {
                const data = JSON.parse(body);
                let { name, content, image, createdAt } = data;
                const newPost = await Post.create({
                    name,
                    content,
                    image,
                    createdAt,
                });
                successHandle(res,200,newPost,"新增成功");
            } catch (error) {
                errorHandle(res,400,"欄位錯誤或缺少");
                res.end();
            }
        })
    }else if(req.url.startsWith("/posts/") && req.method=="PATCH"){
        req.on("end",async()=>{
            try {
                const id = req.url.split('/').pop();
                const index = Post.findIndex(element => element.id == id);
                const data = JSON.parse(body);
                if(index == id) {
                    let { content, image, createdAt } = data;
                    const posts = await Post.findByIdAndUpdate(id,
                        {
                            $set: {
                                content,
                                image,
                                createdAt,
                            },
                        },
                    )
                    successHandle(res,200,posts, "修改成功");
                }else {
                    errorHandle(res,400,"id錯誤");
                }
            }catch(error){
                errorHandle(res,400,"找不到此筆資料");
            }
        })
    }else if(req.url=="/posts" && req.method=="DELETE"){
        const postsDeleteAll = await Post.deleteMany({});
        successHandle(res,200,postsDeleteAll);
    }else if (req.url.startsWith("/posts/") && req.method=="DELETE") {
        req.on("end",async()=>{
            try {
                const id = req.url.split('/').pop();
                const index = Post.findIndex(element => element.id == id);
                if(index == id) {
                    const posts = await Post.findByIdAndDelete(id);
                    successHandle(res,200,posts, "刪除成功");
                }else {
                    errorHandle(res,400,"id錯誤");
                }
            } catch (error) {
                errorHandle(res,400,"找不到此筆資料");
            }
        })
    }else if (req.method=="OPTIONS") {
        successHandle(res);
    }
    else {
        errorHandle(res,404,"無此網站路由");
    }
}

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);