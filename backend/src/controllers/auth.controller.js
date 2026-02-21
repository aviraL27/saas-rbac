import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";

/*
  @desc   Register new user
  @route  POST /api/auth/register
*/
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const userRole = await Role.findOne({ name: "USER" });
    if (!userRole) {
      return res.status(500).json({ message: "Default USER role not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: userRole._id,
    });

    return res.status(201).json({
      message: "User registered successfully",
      userId: newUser._id,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/*
  @desc   Login user
  @route  POST /api/auth/login
*/
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        roleId: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};