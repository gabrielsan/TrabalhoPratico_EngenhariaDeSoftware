const { DataTypes } = require("sequelize");
const sequelize = require("../../database/database");

const Usuario = sequelize.define(
  "Usuario",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "usuario",
    timestamps: true, // Adicionando os campos createdAt e updatedAt
  }
);

module.exports = Usuario;
