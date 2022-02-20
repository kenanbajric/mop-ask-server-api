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

// Post a question
router.post("/", isAuth, async (req, res, next) => {
  try {
    const results = await Question.create({
      question_title: req.body.questionTitle,
      question_text: req.body.questionText,
      userId: req.userId,
    });
    res.status(201).json({
      status: "Question saved to database",
      data: {
        results: results,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Fetch all questions
router.get("/", async (req, res, next) => {
  try {
    const results = await Question.findAll({
      include: [{ model: User, as: "user", required: false }],
    });
    res.status(200).json({
      status: "All questions successfully fetched",
      data: {
        results: results.length,
        questions: results,
      },
    });
  } catch (err) {
    next(err);
  }
});

// "My Question Page"
router.get("/my-questions", isAuth, async (req, res, next) => {
  try {
    const myQuestion = await Question.findAll({
      where: {
        userId: req.userId,
      },
      order: [["createdAt", "DESC"]],
      limit: req.query.limit || 20,
      offset: req.query.skip || 0,
    });
    res.status(200).json({
      status: "My Questions page successfully fetched",
      data: {
        results: myQuestion.length,
        latestQuestions: myQuestion,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Fetch one questions
router.get("/:id", async (req, res, next) => {
  try {
    const question = await Question.findOne({ where: { id: req.params.id } });
    const user = await User.findOne({
      where: { id: question.userId },
      attributes: ["id", "first_name", "last_name", "number_of_answers"],
    });
    res.status(200).json({
      status: "A question successfully fetched",
      data: {
        question: question,
        user: user,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Upvote a question
router.put("/:id", isAuth, async (req, res, next) => {
  try {
    const question = await Question.findOne({ where: { id: req.params.id } });

    // const query = {
    //   name: "fetch-upvote",
    //   text: "SELECT * FROM upvotes WHERE question_id = $1",
    //   values: [question.id],
    // };

    const upvotes = await db.query(
      `SELECT * FROM upvotes WHERE question_id =${question.id}`
    );
    // Query above is vulnerable on SQL injection

    // Check if user already upvoted on this question
    for (const upvote of upvotes[0]) {
      if (upvote.user_id !== req.userId) {
        res.status(206).json({
          status: 206,
          statusMessage: "User already upvoted this question",
          data: {
            upvotes: upvotes[0],
          },
        });
        return;
      }
    }
    question.upvote += 1;
    await question.save();

    const storedUpvote = await db.query(
      `INSERT INTO upvotes (question_id, user_id) VALUES (${question.id}, ${req.userId})`
    );

    console.log(storedUpvote);

    res.status(201).json({
      status: 201,
      statusMessage: "Upvote saved to database",
      data: {
        questionUpvotes: question.upvote,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Answers
// Post an answer
router.post("/:id", isAuth, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.userId } });
    const results = await Answer.create({
      answer_text: req.body.answerText,
      userId: req.userId,
      questionId: req.params.id,
    });
    user.number_of_answers += 1;
    user.save();
    res.status(201).json({
      status: "Answer saved to database",
      data: {
        results: results,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Edit answer
router.put("/answer/:id", isAuth, async (req, res, next) => {
  try {
    const answer = await Answer.findOne({ where: { id: req.params.id } });
    if (answer.userId != req.userId) {
      res.status(403).json({
        status: 403,
        statusMessage: "You dont have permission to edit this answer",
        data: {
          answer: answer,
        },
      });
      return;
    }

    answer.answer_text = req.body.answerText;
    await answer.save();

    console.log("novi odgovor " + answer.answer_text);

    res.status(201).json({
      status: 201,
      statusMessage: "Answer saved to database",
      data: {
        answer: answer,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Delete answer
router.delete("/answer/:id", isAuth, async (req, res, next) => {
  try {
    const answer = await Answer.findOne({ where: { id: req.params.id } });
    if (answer.userId != req.userId) {
      res.status(403).json({
        status: 403,
        statusMessage: "You dont have permission to delete this answer",
        data: {
          answer: answer,
        },
      });
      return;
    }

    await answer.destroy();

    res.status(201).json({
      status: 201,
      statusMessage: "Answer deleted",
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
