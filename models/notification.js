const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Notification = sequelize.define("notification", {
  id: {
    type: DataTypes.INTEGER, // Implement uuid as ID
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  question_title: {
    type: DataTypes.STRING,
  },
  answer_text: {
    type: DataTypes.STRING,
  },
  isNew: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Notification;
