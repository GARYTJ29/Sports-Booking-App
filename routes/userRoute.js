const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    regexEmail = /(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi
    regexUsername = /(^[\w\d_]+$)/gm
    if(!regexUsername.test(req.body.username)){
      //throwing invalid username
      return res
        .status(200)
        .send({ message: "Username Invalid.Username should only contain A-Z,a-z,0-9,_ ", success: false });
    }
    if(!regexEmail.test(req.body.email)){
      //throwing invalid email
      return res
        .status(200)
        .send({ message: "Invalid Email.", success: false });
    }
    const userExists = await User.findOne({ email: req.body.email }) || await User.findOne({ username: req.body.username });
    if (userExists) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }
    
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newuser = new User(req.body);
    await newuser.save();
    res
      .status(200)
      .send({ message: "User created successfully", success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error creating user", success: false, error });
  }
});

router.post("/login", async (req, res) => {
    try {
        let user = await User.findOne({ username: req.body.username });
        if (!user) {
          user = await User.findOne({ email: req.body.username })
          if (!user) {
          return res
            .status(200)
            .send({ message: "User does not exist", success: false });
          }
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
          return res
            .status(200)
            .send({ message: "Password is incorrect", success: false });
        } else {
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
          });
          res
            .status(200)
            .send({ message: "Login successful", success: true, data: token });
        }
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .send({ message: "Error logging in", success: false, error });
      }
});
module.exports = router