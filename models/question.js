const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../db");

const Question = sequelize.define("question", {
  id: {
    type: DataTypes.INTEGER, // Implement uuid as ID
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  question_title: {
    type: DataTypes.STRING,
  },
  question_text: {
    type: DataTypes.STRING,
  },
  upvote: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  // reference to user who created a question
});

module.exports = Question;
