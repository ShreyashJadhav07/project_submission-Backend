const PostModel = require("../Model/PostModel");



async function createPost(req,res){
    try{
        const { content } =req.body;
        const userId=req.userId;

        if(!content){
            return res.status(400).json({
                message:"Post Content required"
            });
        }
        const newPost = await PostModel.create({
            content,
            author: userId
        });

        res.status(201).json({ 
            message: "Post Created",
            Post: newPost
        });

    } catch(err){
          console.error("Error in createPost:", err);
          res.status(500).json({ message: "Server error" });

    }


}

async function getAllPosts(req,res) {
    try{
        const posts= await PostModel.find()
        .populate("author", "name email") 
        .sort({ createdAt: -1 });

     res.status(200).json({ posts });
  } catch (err) {
    console.error("Error in getAllPosts:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getUserPosts(req, res) {
  try {
    const userId = req.params.userId;

    const posts = await PostModel.find({ author: userId })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ posts });
  } catch (err) {
    console.error("Error in getUserPosts:", err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports ={
    createPost,
    getAllPosts,
    getUserPosts
}