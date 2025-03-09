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
      // Check for token in both cookie and Authorization header
      const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

      if (!token) {
          return res.status(401).json({ 
              error: "No token provided",
              redirect: "/login"
          });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded._id);

      if (!user) {
          return res.status(401).json({ 
              error: "User not found",
              redirect: "/start"
          });
      }

      req.user = user;
      next();
  } catch (error) {
      return res.status(401).json({ 
          error: "Not authorized",
          redirect: "/start"
      });
  }
};