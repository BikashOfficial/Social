const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const fs = require('fs').promises;
const path = require('path');

// module.exports.registerUser = async (req, res) => {
//   try {
//     const { name, email, password,username } = req.body;
//     // Validate inputs
//     if (!name || !email || !password || !username) {
//       return res
//         .status(400)
//         .json({ error: "Please provide all required fields" });
//     }
//     // Check if email already exists
//     const existingUser = await userModel.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: "Email already exists" });
//     }
//     // const existingUsername = await userModel.findOne({ username });
//     // if (existingUser) {
//     //   return res.status(400).json({ error: "Email already exists" });
//     // }

//     const hashedPassword = await userModel.hashPassword(password);

//     const user = await userService.createUser({
//       name,
//       email,
//       password: hashedPassword,
//       username,
//     });

//     console.log(user);

//     const token = user.generateAuthToken();

//     res.cookie("token", token, {
//       httpOnly: true,
//       // secure: process.env.NODE_ENV === 'production', // Use secure in production
//       sameSite: "strict",
//       maxAge: 24 * 60 * 60 * 1000, // 24 hours
//     });

//     res.status(201).json({ token, user });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(500).json({ error: "An error occurred during registration" });
//   }
// };

module.exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;
    
    // Validate inputs
    if (!name || !email || !password || !username) {
      return res.status(400).json({ error: "Please provide all required fields" });
    }

    // Check if email already exists
    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Check if username already exists
    const existingUsername = await userModel.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // Hash password
    const hashedPassword = await userModel.hashPassword(password);

    // Create user
    const user = await userService.createUser({
      name,
      email,
      password: hashedPassword,
      username,
    });

    // Generate token
    const token = user.generateAuthToken();

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // Send response
    res.status(201).json({ 
      message: "Registration successful",
      token, 
      user 
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      error: error.message || "An error occurred during registration" 
    });
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = user.generateAuthToken();

    // res.cookie('token', token);

    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production', // Use secure in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "An error occurred during login" });
  }
};

module.exports.getProfile = async (req, res) => {
  res.status(200).json(req.user);
};

module.exports.logoutUser = async (req, res) => {
  //   res.clearCookie("token");

  //   res.status(200).json({ message: "Logged out successfully" });

  try {
    res.clearCookie("token", {
      httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Logout failed" });
  }
};


module.exports.checkUsername = async (req, res) => {
  try {
    const username = req.params.value;
    const existingUser = await userModel.findOne({ name: username });
    
    res.json({
      available: !existingUser,
      message: existingUser ? 'Username is taken' : 'Username is available'
    });
  } catch (error) {
    console.error('Username check error:', error);
    res.status(500).json({ error: 'Error checking username availability' });
  }
};


module.exports.updateProfile = async (req, res) => {
  try {
      const { name, bio, username } = req.body;
      const userId = req.user._id;

      // Validate input
      if (!name && !bio && !username) {
          return res.status(400).json({ error: "No updates provided" });
      }

      const updates = {};
      if (name) updates.name = name;
      if (bio !== undefined) updates.bio = bio;
      if (username) {
          // Check if username is already taken
          const existingUser = await userModel.findOne({ 
              username, 
              _id: { $ne: userId } 
          });
          if (existingUser) {
              return res.status(400).json({ error: "Username already taken" });
          }
          updates.username = username;
      }

      // Handle profile photo update
      if (req.file) {
          // Get the old profile photo path
          const user = await userModel.findById(userId);
          if (user.profilePhoto && user.profilePhoto !== 'default-avatar.png') {
              // Delete the old profile photo
              const oldPhotoPath = path.join(__dirname, '../uploads/profiles', user.profilePhoto);
              try {
                  await fs.unlink(oldPhotoPath);
              } catch (err) {
                  console.error('Error deleting old profile photo:', err);
              }
          }
          updates.profilePhoto = req.file.filename;
      }

      const updatedUser = await userModel.findByIdAndUpdate(
          userId,
          { $set: updates },
          { 
              new: true,
              runValidators: true,
              select: '-password'
          }
      );

      if (!updatedUser) {
          return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({
          message: "Profile updated successfully",
          user: updatedUser
      });

  } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ 
          error: "An error occurred while updating profile"
      });
  }
};

// Search users by username
module.exports.searchUsers = async (req, res) => {
    try {
        const username = req.query.username;
        if (!username) {
            return res.status(400).json({
                success: false,
                message: "Username is required"
            });
        }

        // Find users where username matches the search term (case insensitive)
        const users = await userModel.find({
            username: { $regex: username, $options: 'i' },
            _id: { $ne: req.user._id } // Exclude the current user
        })
        .select('name username bio')
        .limit(10);

        res.json({
            success: true,
            users
        });
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({
            success: false,
            message: "Error searching users"
        });
    }
};

// Send friend request
module.exports.sendFriendRequest = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Check if users are already friends
        const existingFriendship = await userModel.findOne({
            _id: req.user._id,
            friends: userId
        });

        if (existingFriendship) {
            return res.status(400).json({
                success: false,
                message: "Already friends with this user"
            });
        }

        // Check if request already exists
        const existingRequest = await userModel.findOne({
            _id: userId,
            'friendRequests.from': req.user._id
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: "Friend request already sent"
            });
        }

        // Add friend request
        await userModel.findByIdAndUpdate(userId, {
            $push: {
                friendRequests: {
                    from: req.user._id,
                    status: 'pending'
                }
            }
        });

        res.json({
            success: true,
            message: "Friend request sent successfully"
        });
    } catch (err) {
        console.error('Friend request error:', err);
        res.status(500).json({
            success: false,
            message: "Error sending friend request"
        });
    }
};

// Accept friend request
module.exports.acceptFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.params;

        const user = await userModel.findOne({
            _id: req.user._id,
            'friendRequests._id': requestId
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Friend request not found"
            });
        }

        const request = user.friendRequests.id(requestId);
        if (request.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: "Request already processed"
            });
        }

        // Update request status
        request.status = 'accepted';
        await user.save();

        // Add users as friends
        await userModel.findByIdAndUpdate(req.user._id, {
            $push: { friends: request.from }
        });
        await userModel.findByIdAndUpdate(request.from, {
            $push: { friends: req.user._id }
        });

        res.json({
            success: true,
            message: "Friend request accepted"
        });
    } catch (err) {
        console.error('Accept friend request error:', err);
        res.status(500).json({
            success: false,
            message: "Error accepting friend request"
        });
    }
};

// Remove friend
module.exports.removeFriend = async (req, res) => {
    try {
        const { friendId } = req.params;

        // Remove friend from both users
        await userModel.findByIdAndUpdate(req.user._id, {
            $pull: { friends: friendId }
        });
        await userModel.findByIdAndUpdate(friendId, {
            $pull: { friends: req.user._id }
        });

        res.json({
            success: true,
            message: "Friend removed successfully"
        });
    } catch (err) {
        console.error('Remove friend error:', err);
        res.status(500).json({
            success: false,
            message: "Error removing friend"
        });
    }
};

// Get friend requests
module.exports.getFriendRequests = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id)
            .populate('friendRequests.from', 'name username');

        res.json({
            success: true,
            requests: user.friendRequests.filter(r => r.status === 'pending')
        });
    } catch (err) {
        console.error('Get friend requests error:', err);
        res.status(500).json({
            success: false,
            message: "Error getting friend requests"
        });
    }
};

// Get friends list
module.exports.getFriends = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id)
            .populate('friends', 'name username bio');

        res.json({
            success: true,
            friends: user.friends
        });
    } catch (err) {
        console.error('Get friends error:', err);
        res.status(500).json({
            success: false,
            message: "Error getting friends list"
        });
    }
};