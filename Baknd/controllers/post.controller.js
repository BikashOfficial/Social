const postsModel = require("../models/post.model");
const userModel = require("../models/user.model");

module.exports.createPost = async (req, res) => {
  try {
    console.log('Request file:', req.file);
    console.log('Request body:', req.body);

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "Please upload an image" 
      });
    }

    // Create new post
    const post = new postsModel({
      title: req.body.title || 'Untitled',
      image: req.file.filename,
      user: req.user._id,
      location: req.body.location || '',
    });

    // Save the post
    const savedPost = await post.save();

    // Update user's posts array
    await userModel.findByIdAndUpdate(
      req.user._id,
      {
        $push: { posts: savedPost._id }
      },
      { new: true }
    );

    res.status(201).json({ 
      success: true, 
      message: "Post created successfully",
      post: savedPost 
    });

  } catch (err) {
    console.error('Error in createPost:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message || "Error creating post" 
    });
  }
};

module.exports.deletePost = async (req, res) => {
  try {
    const post = await postsModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: "Post not found" 
      });
    }

    // Check if user owns the post
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: "You can only delete your own posts" 
      });
    }

    // Remove post from user's posts array
    await userModel.findByIdAndUpdate(
      req.user._id,
      { $pull: { posts: post._id } }
    );

    // Delete the post
    await postsModel.findByIdAndDelete(req.params.id);

    res.json({ 
      success: true, 
      message: "Post deleted successfully" 
    });

  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message || "Error deleting post" 
    });
  }
};

module.exports.getPost = async (req, res) => {
  try {
    const post = await postsModel.findById(req.params.id)
      .populate('user', 'username email')
      .populate('likes', 'username');

    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: "Post not found" 
      });
    }

    res.json({ 
      success: true, 
      post 
    });

  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

module.exports.getPosts = async (req, res) => {
  try {
    const posts = await postsModel.aggregate([
      { $sample: { size: 50 } },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'users',
          localField: 'comments.user',
          foreignField: '_id',
          as: 'commentUsers'
        }
      },
      {
        $project: {
          title: 1,
          image: 1,
          location: 1,
          likes: 1,
          comments: 1,
          createdAt: 1,
          'user.username': 1,
          'user.email': 1,
          'user._id': 1,
          'user.profilePhoto': 1,
          likesCount: { $size: '$likes' },
          commentsCount: { $size: '$comments' }
        }
      }
    ]);

    res.json({
      success: true,
      posts
    });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Error fetching posts'
    });
  }
};

module.exports.updatePost = async (req, res) => {
  try {
    const post = await postsModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: "Post not found" 
      });
    }

    // Check if user owns the post
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: "You can only edit your own posts" 
      });
    }

    const updatedPost = await postsModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          location: req.body.location
        }
      },
      { 
        new: true,
        runValidators: true 
      }
    ).populate('user', 'username email _id');

    res.json({ 
      success: true, 
      message: "Post updated successfully",
      post: updatedPost 
    });

  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message || "Error updating post" 
    });
  }
};

// Add comment to post
module.exports.addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                success: false,
                message: "Comment text is required"
            });
        }

        const post = await postsModel.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const comment = {
            user: req.user._id,
            text
        };

        post.comments.push(comment);
        await post.save();

        // Populate the user info for the new comment
        const populatedPost = await postsModel.findById(postId)
            .populate('comments.user', 'username profilePhoto');

        const newComment = populatedPost.comments[populatedPost.comments.length - 1];

        res.json({
            success: true,
            comment: newComment
        });

    } catch (err) {
        console.error('Add comment error:', err);
        res.status(500).json({
            success: false,
            message: "Error adding comment"
        });
    }
};

// Delete comment
module.exports.deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;

        const post = await postsModel.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        // Check if user owns the comment
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own comments"
            });
        }

        post.comments.pull(commentId);
        await post.save();

        res.json({
            success: true,
            message: "Comment deleted successfully"
        });

    } catch (err) {
        console.error('Delete comment error:', err);
        res.status(500).json({
            success: false,
            message: "Error deleting comment"
        });
    }
};

// Get comments for a post
module.exports.getComments = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await postsModel.findById(postId)
            .populate('comments.user', 'username profilePhoto');

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        res.json({
            success: true,
            comments: post.comments
        });

    } catch (err) {
        console.error('Get comments error:', err);
        res.status(500).json({
            success: false,
            message: "Error getting comments"
        });
    }
};

// Add like/unlike functionality
module.exports.toggleLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const post = await postsModel.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const likeIndex = post.likes.indexOf(userId);
        if (likeIndex === -1) {
            // Like the post
            post.likes.push(userId);
        } else {
            // Unlike the post
            post.likes.splice(likeIndex, 1);
        }

        await post.save();

        res.json({
            success: true,
            likes: post.likes,
            message: likeIndex === -1 ? "Post liked" : "Post unliked"
        });

    } catch (err) {
        console.error('Toggle like error:', err);
        res.status(500).json({
            success: false,
            message: "Error toggling like"
        });
    }
};
