const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Room = require("./models/room");
const headers = require("./utils/headers");
const errorHandle = require("./utils/errorHandle");
const successHandle = require("./utils/successHandle");

dotenv.config({path: './config.env'});
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log('資料庫連接成功'));


const requestListener = async (req,res)=>{
    let body = "";
    req.on("data",chunk=>{
        body+=chunk;
    })
    if(req.url=="/rooms" && req.method=="GET"){
        const rooms = await Room.find();
        res.writeHead(200,headers);
        res.write(JSON.stringify({
            "status":"success",
            rooms
        }))
        res.end()
    }else if(req.url=="/rooms" && req.method=="POST"){
        req.on("end",async()=>{
            try {
                const data = JSON.parse(body);
                const newRoom = await Room.create(
                    {
                        name: data.name,
                        price: data.price,
                        rating: data.rating
                        
                    }
                )
                successHandle(res,200,newRoom,"新增成功");
            } catch (error) {
                errorHandle(res,400,"欄位錯誤或缺少");
                res.end();
            }
        })
    }else if(req.url.startsWith("/rooms/") && req.method=="PATCH"){
        req.on("end",async()=>{
            try {
                const id = req.url.split('/').pop();
                const data = JSON.parse(body);
                await Room.findByIdAndUpdate(id,
                    {
                        name: data.name,
                        price: data.price,
                        rating: data.rating   
                    },
                )
                successHandle(res,200,"修改成功");
            }catch(error){
                errorHandle(res,400,"找不到此筆資料");
            }
        })
    }else if(req.url=="/rooms" && req.method=="DELETE"){
        const roomDeleteAll = await Room.deleteMany({});
        successHandle(res,200,roomDeleteAll);
    }else if (req.url.startsWith("/rooms/") && req.method=="DELETE") {
        req.on("end",async()=>{
            try {
                const id = req.url.split('/').pop();
                await Room.findByIdAndDelete(id);
                successHandle(res,200,"刪除成功");
            } catch (error) {
                errorHandle(res,400,"找不到此筆資料");
            }
        })
    }else if (req.method=="OPTIONS") {
        successHandle(res);
    }
    else {
        errorHandle(res,404,"無此網站路由罰你回去重寫網址");
    }
}

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);