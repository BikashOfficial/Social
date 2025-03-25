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
      console.log('Headers:', req.headers.authorization ? 'Authorization header present' : 'No Authorization header');
      console.log('Cookies:', req.cookies ? 'Cookies present' : 'No cookies');
      
      // Check for token in both cookie and Authorization header
      const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

      if (!token) {
          console.log('No token found');
          return res.status(401).json({ 
              error: "No token provided",
              redirect: "/login"
          });
      }

      console.log('Token found, verifying...');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded._id);

      if (!user) {
          console.log('User not found for token');
          return res.status(401).json({ 
              error: "User not found",
              redirect: "/start"
          });
      }

      console.log('User authenticated:', user.email);
      req.user = user;
      next();
  } catch (error) {
      console.error('Auth error:', error.message);
      return res.status(401).json({ 
          error: "Not authorized",
          redirect: "/start"
      });
  }
};