const User = require("../models/User");
const Blacklist = require("../models/Blacklist");
const bcrypt = require("bcrypt"); // npm install express bcryptjs jsonwebtoken
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide all required fields (email, password)",
      });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({
      statusCode: 201,
      message: "User added successfully",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: "Failed to add new user",
      error: error.message,
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }); // Gunakan findOne dan await

    if (!user) {
      return res.status(401).json({ message: "Email not found" });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.EXPRESS_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
      res.status(200).json({
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(401).json({ message: "Email atau kata sandi tidak valid" });
    }
  } catch (error) {
    console.error("Error during login:", error); // Tambahkan log kesalahan
    res.status(500).json({ message: "Kesalahan server", error });
  }
};

// Logout User
const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.token; // Extract token from httpOnly cookie
    if (!token) return res.status(401).json({ message: "No token provided" });

    // const tokenHash = crypto.createHash("sha256").update(token).digest("hex"); // Hash token before storing in the database
    // const checkIfBlacklisted = await Blacklist.findOne({ token: tokenHash }); // Check if token is already blacklisted

    // if (checkIfBlacklisted) {
    //   return res.sendStatus(204); // If already blacklisted, no need to blacklist again
    // }

    // // Add token to blacklist
    // const newBlacklist = new Blacklist({ token: tokenHash });
    // await newBlacklist.save();

    res.clearCookie("token"); // Clear the httpOnly cookie
    res.status(200).json({ message: "User successfully logged out" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
