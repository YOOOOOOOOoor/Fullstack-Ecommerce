import express from "express";
import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/xqjlg4ei/image/upload/v1782918066/Sample_User_Icon_yqt0wv.png";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: 24 * 60 * 60 * 1000 * 5, // 5 days
};

const tokenGenerate = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "5d" });
};

//register
export const register = async (req, res) => {
  const { name, email, password, phone, avatar } = req.body;
  if (!name || !email || !password || !phone) {
    return res.status(400).json({ msg: "Please fill all the fields" });
  }

  const checkUser = await pool.query("Select * from users where email=$1", [
    email,
  ]);
  if (checkUser.rows.length > 0) {
    return res.status(400).json({ msg: "User already exists" });
  }
  const hashPass = await bcrypt.hash(password, 10);
  const user = await pool.query(
    "insert into users(name,email,password,phone,avatar) values($1,$2,$3,$4,$5) returning id,name,email,phone,avatar,role",
    [
      name,
      email.toLowerCase().trim(),
      hashPass,
      phone,
      avatar || DEFAULT_AVATAR,
    ],
  );

  const token = tokenGenerate(user.rows[0].id, user.rows[0].role);
  res.cookie("token", token, cookieOptions);
  res.status(201).json({
    msg: "User registered successfully",
    user: {
      name: user.rows[0].name,
      email: user.rows[0].email,
      phone: user.rows[0].phone,
      avatar: user.rows[0].avatar,
      role: user.rows[0].role,
    },
  });
};

//login
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Please fill all the fields" });
  }
  const checkEmail = await pool.query("select * from users where email=$1", [
    email.toLowerCase().trim(),
  ]);
  if (checkEmail.rows.length === 0) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }
  const user = checkEmail.rows[0];
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }
  const token = tokenGenerate(user.id, user.role);
  res.cookie("token", token, cookieOptions);
  res.status(200).json({
    msg: "User logged in successfully",
    user: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
    },
  });
};

//me
export const me = async (req, res) => {
  res.status(200).json({
    msg: "User logged in successfully",
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      avatar: req.user.avatar,
      role: req.user.role,
    },
  });
};

//logout
export const logout = async (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.status(200).json({ msg: "User logged out successfully" });
};
