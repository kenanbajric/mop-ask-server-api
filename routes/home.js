const express = require("express");
const isAuth = require("../middleware/is-auth");

// Database
const db = require("../db");

// Models
const Question = require("../models/question");
const User = require("../models/user");
const Answer = require("../models/answer");

// Router
const router = express.Router();

// "Home Page" - Fetch last 20 questions & Fetch top 10 most upvoted questions & Fetch top 5 users with most answers
router.get("/", async (req, res, next) => {
  try {
    const latestQuestions = await Question.findAll({
      include: [
        {
          model: User,
          required: false,
          attributes: [
            "id",
            "first_name",
            "last_name",
            "email",
            "number_of_answers",
          ],
        },
        { model: Answer, required: false },
      ],
      order: [["createdAt", "DESC"]],
      limit: 20,
    });
    const hotQuestions = await Question.findAll({
      include: [
        {
          model: User,
          required: false,
          attributes: [
            "id",
            "first_name",
            "last_name",
            "email",
            "number_of_answers",
          ],
        },
        { model: Answer, required: false },
      ],
      order: [["upvote", "DESC"]],
      limit: 5,
    });
    const topUsers = await User.findAll({
      order: [["number_of_answers", "DESC"]],
      limit: 10,
    });
    res.status(200).json({
      status: "Home page successfully fetched",
      data: {
        latestQuestions: latestQuestions,
        hotQuestions: hotQuestions,
        topUsers: topUsers,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Load more
router.get("/loadmore", async (req, res, next) => {
  // Simulating a slower API response
  for (let i = 0; i < 100000000; i++) {
    1 + 1;
  }
  // End of simulation

  try {
    const loadedQuestions = await Question.findAll({
      include: [
        {
          model: User,
          required: false,
          attributes: [
            "id",
            "first_name",
            "last_name",
            "email",
            "number_of_answers",
          ],
        },
        { model: Answer, required: false },
      ],
      order: [["createdAt", "DESC"]],
      limit: req.query.limit,
      offset: req.query.skip,
    });
    res.status(200).json({
      status: "Successfully loaded more question",
      data: {
        loadedQuestions: loadedQuestions,
      },
    });
  } catch (err) {
    next(err);
  }
});

// "Profile Page"
router.get("/my-profile", isAuth, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.userId } });
    res.status(200).json({
      status: "My Profile page successfully fetched",
      data: {
        user: user,
      },
    });
  } catch (err) {
    next(err);
  }
});



module.exports = router;
