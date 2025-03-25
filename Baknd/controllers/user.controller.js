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

    // Set cookie with proper flags for cross-domain
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction, // Use secure in production
      sameSite: isProduction ? 'none' : 'strict', // Allow cross-site cookies in production
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

    // Set cookie with proper flags for cross-domain
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction, // Use secure in production
      sameSite: isProduction ? 'none' : 'strict', // Allow cross-site cookies in production
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

module.exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await userModel.findById(userId)
      .select('name username bio profilePhoto');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (err) {
    console.error('Get user profile error:', err);
    res.status(500).json({
      success: false,
      message: "Error fetching user profile"
    });
  }
};

module.exports.logoutUser = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'strict',
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
    console.log('Update profile request received', {
      body: req.body,
      file: req.file ? {
        filename: req.file.filename,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : 'No file uploaded'
    });

    const userId = req.user._id;
    const updatedData = { ...req.body };
    
    // Handle profile photo if it was uploaded
    if (req.file) {
      console.log(`Profile photo uploaded: ${req.file.filename}`);
      updatedData.profilePhoto = req.file.filename;
    }
    
    // Remove any empty fields
    Object.keys(updatedData).forEach(key => {
      if (updatedData[key] === '' || updatedData[key] === undefined) {
        delete updatedData[key];
      }
    });
    
    console.log('Final update data:', updatedData);

    const updatedUser = await userModel.findByIdAndUpdate(
      userId, 
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      console.log('User not found for update');
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get the full URL of the profile photo for the client
    let profilePhotoUrl = null;
    if (updatedUser.profilePhoto) {
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      profilePhotoUrl = `${baseUrl}/uploads/profiles/${updatedUser.profilePhoto}`;
      console.log('Profile photo URL generated:', profilePhotoUrl);
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        ...updatedUser._doc,
        profilePhotoUrl
      }
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
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
        .select('name username bio profilePhoto')
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
        const senderId = req.user._id;

        // Check if users are same
        if (userId === senderId.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot send friend request to yourself"
            });
        }

        const receiver = await userModel.findById(userId);
        if (!receiver) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if they are already friends
        if (receiver.friends.includes(senderId)) {
            return res.status(400).json({
                success: false,
                message: "You are already friends"
            });
        }

        // Check if request already exists
        const existingRequest = receiver.friendRequests.find(
            request => request.from.toString() === senderId.toString()
        );

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: "Friend request already sent"
            });
        }

        // Add friend request
        receiver.friendRequests.push({
            from: senderId,
            status: 'pending'
        });

        await receiver.save();

        res.json({
            success: true,
            message: "Friend request sent successfully"
        });

    } catch (err) {
        console.error('Send friend request error:', err);
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
        const userId = req.user._id;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Find the request
        const request = user.friendRequests.id(requestId);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Friend request not found"
            });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: "Friend request already processed"
            });
        }

        // Add each other as friends
        user.friends.push(request.from);
        request.status = 'accepted';

        const sender = await userModel.findById(request.from);
        if (sender) {
            sender.friends.push(userId);
            await sender.save();
        }

        await user.save();

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
            .populate('friendRequests.from', 'username name profilePhoto');

        const pendingRequests = user.friendRequests.filter(
            request => request.status === 'pending'
        );

        res.json({
            success: true,
            requests: pendingRequests
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
            .populate('friends', 'name username bio profilePhoto');

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