const mongoose = require("mongoose");

const postSchemaRules = {
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
};


const postSchema = new mongoose.Schema(postSchemaRules, { 
  timestamps: true  
});

const PostModel = mongoose.model("Post", postSchema);

module.exports = PostModel;



