const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Model pengguna

// Middleware for checking if user is an admin
exports.isAdmin = async (req, res, next) => {
  let token = req.cookies.token; // get token from cookie

  if (token) {
    try {
      // veryfy jwt token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // find user by id from decoded token
      const user = await User.findById(decoded.id);

      // if user not found
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }

      // checking if user is admin
      if (!user.isAdmin) {
        return res.status(403).json({ message: "Require Admin Role!" });
      }

      // if user is admin, continue to next middleware
      next();
    } catch (err) {
      console.error("Error during token verification or user lookup:", err);
      return res
        .status(500)
        .json({ message: "Failed to authenticate token", error: err.message });
    }
  } else {
    return res.status(403).json({ message: "No token provided" });
  }
};

// Middleware for checking if user is logged in
exports.protect = async (req, res, next) => {
  let token = req.cookies.token; // get token from cookie

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware for get user id from token
exports.verifyToken = (req, res, next) => {
  try {
    // Extract token from cookie
    const token = req.cookies.token; // Assuming your cookie name is 'token'

    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach userId to the request object
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.error('Token verification failed', error);
    res.status(401).json({ message: 'Invalid token, authorization denied' });
  }
};

