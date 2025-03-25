// const jwt = require("jsonwebtoken");
// const userModel = require("../models/user.model");

// module.exports.authMiddleware = async (req, res, next) => {
//   const token = req.cookies.token;
//   if (!token) {
//     return res.json({ success: false, message: "Not Authorized Login Again" });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await userModel.findById(decoded._id);
//     req.user = user;
//     next();
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error" });
//   }
// };

const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

// exports.authMiddleware = async (req, res, next) => {
//     try {
//         const token = req.cookies.token;

//         if (!token) {
//             return res.status(401).json({ 
//                 error: "No token provided",
//                 redirect: "/login"
//             });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await userModel.findById(decoded.id);

//         if (!user) {
//             return res.status(401).json({ 
//                 error: "User not found",
//                 redirect: "/login"
//             });
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         return res.status(401).json({ 
//             error: "Not authorized",
//             redirect: "/login"
//         });
//     }
// };

exports.authMiddleware = async (req, res, next) => {
  try {
    console.log('Auth middleware running in:', process.env.NODE_ENV);
    console.log('Headers:', req.headers.origin, 'Authorization present:', !!req.headers.authorization);
    console.log('Cookies present:', !!req.cookies, 'Token cookie present:', !!req.cookies.token);
    
    // Check for token in multiple sources
    let token = null;
    
    // 1. Check cookies
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
      console.log('Token found in cookies');
    } 
    // 2. Check Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token found in Authorization header');
    }
    // 3. Check query string (not recommended for production, but useful for debugging)
    else if (req.query && req.query.token) {
      token = req.query.token;
      console.log('Token found in query string');
    }

    if (!token) {
      console.log('No token found in any source');
      return res.status(401).json({ 
        error: "Authentication required",
        redirect: "/login"
      });
    }

    console.log('Token found, verifying...');
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError.message);
      return res.status(401).json({ 
        error: "Invalid or expired token",
        redirect: "/login"
      });
    }

    const user = await userModel.findById(decoded._id);

    if (!user) {
      console.log('User not found for token');
      return res.status(401).json({ 
        error: "User not found",
        redirect: "/start"
      });
    }

    console.log('User authenticated:', user.email);
    
    // Reset token as cookie if it came from another source
    if (token && !req.cookies.token && process.env.NODE_ENV === 'production') {
      const isProduction = process.env.NODE_ENV === 'production';
      res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      console.log('Reestablished token cookie');
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ 
      error: "Authentication failed",
      redirect: "/start"
    });
  }
};