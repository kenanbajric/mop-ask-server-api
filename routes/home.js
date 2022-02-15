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
      limit: 2,
    });
    const topUsers = await User.findAll({
      order: [["number_of_answers", "DESC"]],
      limit: 2,
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
//

// "My Question Page" - Fetch latest 20 users question
router.get("/my-questions", isAuth, async (req, res, next) => {
  try {
    const myQuestion = await Question.findAll({
      where: {
        userId: req.userId,
      },
    });
    res.status(200).json({
      status: "My Questions page successfully fetched",
      data: {
        results: myQuestion.length,
        questions: myQuestion,
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

// Update profile information
router.post("/my-profile", isAuth, async (req, res, next) => {
  //
});

module.exports = router;
