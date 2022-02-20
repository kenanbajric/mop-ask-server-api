const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
const isAuth = require("../middleware/is-auth");
const jwt_string = process.env.JWT_STRING;

// Database
const db = require("../db");

// Models
const User = require("../models/user");
const Notification = require("../models/notification");

// Router
const router = express.Router();

// User Signup
router.post("/signup", async (req, res, next) => {
  console.log(req.body);
  try {
    //Checking if user already exist
    //

    // Crypting password
    const hashedPw = await bcrypt.hash(req.body.password, 12);
    const results = await User.create({
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email,
      password: hashedPw,
    });
    res.status(201).json({
      status: "User saved to database",
      data: {
        results: results,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Update profile information
router.put("/my-profile", isAuth, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.userId } });
    await user.update({
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email,
    });
    res.status(200).json({
      status: "Profile information updated!",
      data: {
        user: user,
      },
    });
  } catch (err) {
    next(err);
  }
});

// User Login
router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      console.log("User not found.");
      //error handling
    }
    const isEqual = await bcrypt.compare(req.body.password, user.password);
    if (!isEqual) {
      const error = new Error("Wrong password.");
      error.statusCode = 401;
      throw next(error);
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user.id.toString(),
      },
      jwt_string,
      { expiresIn: "5h" }
    );
    res.status(200).json({
      data: {
        status: "User logged in.",
        token: token,
        userId: user.id,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Update a password
router.put("/updatepw", isAuth, async (req, res, next) => {
  console.log("User ID is: " + req.userId);
  try {
    const user = await User.findOne({ where: { id: req.userId } });
    const newHashedPw = await bcrypt.hash(req.body.newPw, 12);
    const isEqual = await bcrypt.compare(req.body.oldPw, user.password);
    console.log("Password is correct: " + isEqual);
    if (!isEqual) {
      const error = new Error("Wrong password.");
      error.statusCode = 401;
      throw next(error);
    }
    await user.update({ password: newHashedPw });
    res.status(201).json({
      data: {
        message: "Password updated!",
        statusCode: 201,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Fetch notifications
router.get("/notifications", isAuth, async (req, res, next) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: +req.userId, isNew: true },
    });
    res.status(200).json({
      status: "All users successfully fetched",
      data: {
        notifications: notifications,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Notification opened
router.put("/notifications/:id", isAuth, async (req, res, next) => {
  try {
    const notification = await Notification.findOne({
      where: { id: +req.params.id },
    });

    notification.isNew = false;

    console.log(notification);
    await notification.save();
    res.status(200).json({
      status: "Notification has been read",
      data: {
        notification: notification,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
