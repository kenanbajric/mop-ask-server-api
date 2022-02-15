const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER, // or maybe Type STRING?
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  first_name: {
    type: DataTypes.STRING,
  },
  last_name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  number_of_answers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  }
});


module.exports = User;
