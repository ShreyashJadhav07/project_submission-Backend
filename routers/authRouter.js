const express=require("express");
const { loginHandler, signupHandler, logoutController } = require("../controllers/AuthController");



const AuthRouter=express.Router();


AuthRouter
         .post("/login",loginHandler)
         .post("/signup",signupHandler)
         .get("/logout",logoutController)


module.exports=AuthRouter;