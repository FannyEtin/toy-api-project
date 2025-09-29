const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel, validateUser } = require("../models/userModel");

router.post("/", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res
        .status(400)
        .json({ err: "Invalid data", details: error.details });
    }

    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ err: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new UserModel({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role || "USER",
    });

    await newUser.save();

    const { password, ...userWithoutPassword } = newUser.toObject();
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(502).json({ msg: "Server error", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "Invalid email or password" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ msg: "Invalid email or password" });

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({ token });
  } catch (err) {
    console.error("Signup error:", err.message)
    res.status(502).json({ msg: "Server error", error: err.message });
  }
});

router.get("/", (req, res) => {
  res.json({ msg: "Users endpoint works" });
});

module.exports = router;