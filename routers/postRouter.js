const express=require('express');
const { protectRouteMiddleware } = require('../controllers/AuthController');
const { createPost, getAllPosts, getUserPosts } = require('../controllers/PostController');

const PostRouter=express.Router();

PostRouter
         .post("/",protectRouteMiddleware,createPost)
         .get("/",getAllPosts)
         .get("/:userId",getUserPosts)


module.exports=PostRouter;

