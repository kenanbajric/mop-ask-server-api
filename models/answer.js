const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../db");

const Answer = sequelize.define("answer", {
  id: {
    type: DataTypes.INTEGER, // Implement uuid as ID
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  answer_text: {
    type: DataTypes.STRING,
  },
  // reference to user who posted an answer
  // reference to answered question
});

module.exports = Answer;
