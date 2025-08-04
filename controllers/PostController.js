const PostModel = require("../Model/PostModel");

async function createPost(req,res){
    try{
        // Add these debug lines
        console.log("=== CREATE POST DEBUG ===");
        console.log("req.body:", req.body);
        console.log("req.headers:", req.headers);
        console.log("req.userId:", req.userId);
        console.log("========================");

        const { content } = req.body;
        const userId = req.userId;

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
        const posts = await PostModel.find()
        .populate("author", "name email") 
        .sort({ createdAt: -1 }); // Sort by newest first

        // Add debug to see timestamps
        console.log("Posts with timestamps:", posts.map(p => ({
            id: p._id,
            content: p.content.substring(0, 20) + "...",
            createdAt: p.createdAt
        })));

     res.status(200).json({ posts });
  } catch (err) {
    console.error("Error in getAllPosts:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getUserPosts(req, res) {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const posts = await PostModel.find({ author: userId })
      .populate("author", "_id name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "User posts fetched successfully",
      posts,
    });
  } catch (err) {
    console.error("Error in getUserPosts:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}


module.exports ={
    createPost,
    getAllPosts,
    getUserPosts
}