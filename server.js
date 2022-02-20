require("dotenv").config();

const express = require("express");
const morgan = require("morgan");

// Models
const User = require("./models/user");
const Question = require("./models/question");
const Answer = require("./models/answer");
const Notification = require("./models/notification");

const app = express();

// Database
const sequelize = require("./db");

// Morgan dev logs
app.use(morgan("dev"));

// Parsing a request
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, userId"
  );
  next();
});

// Routes
app.use("/users", require("./routes/auth"));
app.use("/questions", require("./routes/questions"));
app.use("/home", require("./routes/home"));

const port = process.env.PORT || 5006;

//error handling middleware
app.use((err, req, res, next) => {
  console.log("Error status code is: " + err.statusCode);
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message, data: err });
});

// Models Associations
Question.belongsTo(User, { onDelete: "NO ACTION" });
User.hasMany(Answer, { onDelete: "NO ACTION" });
Question.hasMany(Answer, { onDelete: "NO ACTION" });
Answer.belongsTo(Question, { onDelete: "NO ACTION" });
User.hasMany(Notification, { onDelete: "NO ACTION" });
Notification.belongsTo(User, { onDelete: "NO ACTION" });
Notification.belongsTo(Question, { onDelete: "NO ACTION" });

// Sequlize sync function
sequelize
  .sync()
  .then((result) => {
    // Spinning up a server..
    app.listen(port, () => {
      console.log(`Server is up and listening on port ${port}`);
    });
  })
  .catch((err) => console.log(err));
