const express=require("express");
const app=express();
const mongoose=require("mongoose");
const dotenv=require('dotenv');
const cookieParser=require('cookie-parser');
const cors=require('cors');
const AuthRouter = require("./routers/authRouter");
const PostRouter = require("./routers/postRouter");


dotenv.config();
const dbLink = `mongodb+srv://${process.env.DB_USERNAME}
:${process.env.DB_PASSWORD}@cluster0.qbolmee.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`


mongoose.connect(dbLink)
    .then(function (connection) {
        console.log("connected to db")
}).catch(err => console.log(err))

app.use(cookieParser());
app.use(express.json());

app.use(cors({
 origin: true,
 credentials: true
}));


app.use("/api/auth",AuthRouter);
app.use("/api/posts",PostRouter);

app.listen(3000, function(){
    console.log(`Server is running on port 3000`);
});