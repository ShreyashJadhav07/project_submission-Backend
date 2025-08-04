// const express=require("express");
// const app=express();
// const mongoose=require("mongoose");
// const dotenv=require('dotenv');
// const cookieParser=require('cookie-parser');
// const cors=require('cors');
// const AuthRouter = require("./routers/authRouter");
// const PostRouter = require("./routers/postRouter");


// dotenv.config();
// const dbLink = `mongodb+srv://${process.env.DB_USERNAME}
// :${process.env.DB_PASSWORD}@cluster0.qbolmee.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`


// mongoose.connect(dbLink)
//     .then(function (connection) {
//         console.log("connected to db")
// }).catch(err => console.log(err))

// app.use(cookieParser());
// app.use(express.json());

// app.use(cors({
//  origin: true,
//  credentials: true
// }));


// app.use("/api/auth",AuthRouter);
// app.use("/api/posts",PostRouter);

// app.listen(3010, function(){
//     console.log(`Server is running on port 3010`);
// });


// MUST BE THE VERY FIRST LINE - Load environment variables first
require('dotenv').config();

// Debug: Check if env variables are loaded immediately after dotenv
console.log("=== DOTENV LOADED ===");
console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY);
console.log("DB_USERNAME:", process.env.DB_USERNAME);
console.log("====================");

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const cookieParser=require('cookie-parser');
const cors=require('cors');

// Import routers AFTER dotenv is loaded
const AuthRouter = require("./routers/authRouter");
const PostRouter = require("./routers/postRouter");

const dbLink = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qbolmee.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

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

const PORT = process.env.PORT || 3010;

app.listen(PORT, function(){
    console.log(`Server is running on port ${PORT}`);
});